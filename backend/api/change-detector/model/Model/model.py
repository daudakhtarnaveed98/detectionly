import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np


class Conv2d(nn.Module):
    def __init__(self, in_channels, out_channels, kernel=3, stride=1, dilation=1, padding=1):
        super(Conv2d, self).__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel, stride=stride, dilation=dilation, padding=padding),
            nn.ReLU(),
            nn.BatchNorm2d(out_channels)
        )

    def forward(self, x):
        x = self.conv(x)
        return x


class DoubleConv2d(nn.Module):
    def __init__(self, in_channels, out_channels, kernel=3, stride=1, dilation=1, padding=1):
        super(DoubleConv2d, self).__init__()
        self.double_conv = nn.Sequential(
            Conv2d(in_channels, out_channels, kernel, stride, dilation, padding),
            Conv2d(out_channels, out_channels, kernel, stride, dilation, padding)
        )

    def forward(self, x):
        x = self.double_conv(x)
        return x


class ASPP(nn.Module):
    def __init__(self, in_channels, out_channels):
        super(ASPP, self).__init__()
        self.conv1 = Conv2d(in_channels, out_channels, 1, padding=0)
        self.conv2 = Conv2d(in_channels, out_channels, dilation=3, padding=3)
        self.conv3 = Conv2d(in_channels, out_channels, dilation=6, padding=6)
        self.conv4 = Conv2d(in_channels, out_channels, dilation=9, padding=9)
        self.pool = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            Conv2d(in_channels, out_channels, 1, padding=0)
        )
        self.conv5 = Conv2d(out_channels * 5, out_channels, 1, padding=0)

    def forward(self, x):
        _, _, h, w = x.shape
        x1 = self.conv1(x)
        x2 = self.conv2(x)
        x3 = self.conv3(x)
        x4 = self.conv4(x)
        x5 = self.pool(x)
        x5 = F.interpolate(x5, size=(h, w), mode='bilinear', align_corners=False)
        x = torch.cat((x1, x2, x3, x4, x5), dim=1)
        x = self.conv5(x)
        return x


class DiffConv(nn.Module):
    def __init__(self, in_channels, out_channels):
        super(DiffConv, self).__init__()
        self.conv1 = Conv2d(in_channels, out_channels, 1, padding=0)
        self.conv2 = Conv2d(in_channels, out_channels, 3)
        self.conv3 = Conv2d(out_channels * 2, out_channels, 1, padding=0)

    def forward(self, x):
        x1 = self.conv1(x)
        x2 = self.conv2(x)
        x = torch.cat((x1, x2), dim=1)
        x = self.conv3(x)
        return x


class LocalMSCDNet(nn.Module):
    def __init__(self, in_channels):
        super(LocalMSCDNet, self).__init__()
        self.pool = nn.MaxPool2d(2, 2, return_indices=True)
        self.unpool = nn.MaxUnpool2d(2, 2)
        # Encoder
        self.double_conv1 = DoubleConv2d(in_channels, 16)
        self.double_conv2 = DoubleConv2d(16, 32)
        self.double_conv3 = DoubleConv2d(32, 64)
        self.conv1 = Conv2d(64, 64)
        self.double_conv4 = DoubleConv2d(64, 128)
        self.conv2 = Conv2d(128, 128)
        # Decoder
        self.diff_conv1 = DiffConv(256, 128)
        self.aspp = ASPP(128, 64)
        # self.double_conv5 = DoubleConv2d(128, 64)
        # self.conv3 = Conv2d(64, 64)

        self.diff_conv2 = DiffConv(128, 64)
        self.double_conv6 = DoubleConv2d(128, 64)
        self.conv4 = Conv2d(64, 32)

        self.diff_conv3 = DiffConv(64, 32)
        self.conv5 = Conv2d(64, 32)
        self.conv6 = Conv2d(32, 16)

        self.diff_conv4 = DiffConv(32, 16)
        self.double_conv8 = DoubleConv2d(32, 16)

        self.out = nn.Conv2d(16, 1, 1)

    def forward(self, x1, x2):
        x1_l1, x1_l2, x1_l3, x1_l4, _ = self.encode(x1)
        x2_l1, x2_l2, x2_l3, x2_l4, indices2 = self.encode(x2)

        x = torch.cat((x2_l4, -x1_l4), dim=1)
        x = self.diff_conv1(x)
        x = self.aspp(x)
        # x = self.double_conv5(x)
        # x = self.conv3(x)
        x = self.unpool(x, indices2[2])

        x_s = torch.cat((x2_l3, -x1_l3), dim=1)
        x_s = self.diff_conv2(x_s)
        x = torch.cat((x, x_s), dim=1)
        x = self.double_conv6(x)
        x = self.conv4(x)
        x = self.unpool(x, indices2[1])

        x_s = torch.cat((x2_l2, -x1_l2), dim=1)
        x_s = self.diff_conv3(x_s)
        x = torch.cat((x, x_s), dim=1)
        x = self.conv5(x)
        x = self.conv6(x)
        x = self.unpool(x, indices2[0])

        x_s = torch.cat((x2_l1, -x1_l1), dim=1)
        x_s = self.diff_conv4(x_s)
        x = torch.cat((x, x_s), dim=1)
        x = self.double_conv8(x)

        x = self.out(x)
        return x

    def encode(self, x):
        x1 = self.double_conv1(x)
        x, indices_l1 = self.pool(x1)
        x2 = self.double_conv2(x)
        x, indices_l2 = self.pool(x2)
        x3 = self.double_conv3(x)
        x3 = self.conv1(x3)
        x, indices_l3 = self.pool(x3)
        x4 = self.double_conv4(x)
        x4 = self.conv2(x4)
        return x1, x2, x3, x4, [indices_l1, indices_l2, indices_l3]


class Model:
    def __init__(self, in_channels, patch_size):
        self.in_channels = in_channels
        self.patch_size = patch_size
        self.model = LocalMSCDNet(in_channels)
        self.device = 'cuda:0' if torch.cuda.is_available() else 'cpu'
        checkpoint = torch.load('Model/model.tar', map_location=self.device)
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model = self.model.to(self.device)

    def predict(self, img1, img2):
        assert(img1.shape == (self.patch_size, self.patch_size, self.in_channels))
        assert(img2.shape == img1.shape)

        img1 = (img1 / 255).astype(np.float32)
        img2 = (img2 / 255).astype(np.float32)
        img1 = np.moveaxis(img1, -1, 0)
        img2 = np.moveaxis(img2, -1, 0)
        img1 = np.expand_dims(img1, 0)
        img2 = np.expand_dims(img2, 0)
        img1 = torch.from_numpy(img1.copy())
        img2 = torch.from_numpy(img2.copy())

        self.model.eval()
        with torch.no_grad():
            img1 = img1.to(self.device)
            img2 = img2.to(self.device)
            output = self.model(img1, img2).cpu().numpy()
            output = (output >= 0.5) * 255
            return output[0, 0]
