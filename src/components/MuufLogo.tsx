import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface MuufLogoProps {
  width?: number;
  height?: number;
  color?: string;
  style?: ViewStyle;
}

export const MuufLogo: React.FC<MuufLogoProps> = ({
  width = 280,
  height = 120,
  color = '#FFFFFF',
  style,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 280 120" style={style}>
      {/* Letter M */}
      <Path
        d="M 15 90 Q 12 60, 20 40 Q 25 25, 35 20 Q 40 18, 42 25 Q 43 35, 40 50 Q 38 65, 40 80 Q 42 90, 45 85 Q 48 75, 50 60 Q 52 45, 54 35 Q 56 25, 60 30 Q 62 40, 60 55 Q 58 70, 60 85 Q 62 95, 65 90"
        fill={color}
        stroke="none"
      />

      {/* Letter U (first) */}
      <Path
        d="M 85 35 Q 83 40, 83 50 Q 83 65, 85 75 Q 88 85, 95 88 Q 102 90, 108 85 Q 112 78, 112 65 Q 112 50, 110 40 Q 108 30, 105 35"
        fill={color}
        stroke="none"
      />

      {/* Letter U (second) */}
      <Path
        d="M 135 35 Q 133 40, 133 50 Q 133 65, 135 75 Q 138 85, 145 88 Q 152 90, 158 85 Q 162 78, 162 65 Q 162 50, 160 40 Q 158 30, 155 35"
        fill={color}
        stroke="none"
      />

      {/* Letter F */}
      <Path
        d="M 185 35 Q 183 40, 185 55 Q 187 70, 185 85 Q 183 95, 188 90 Q 195 85, 205 83 M 185 58 Q 190 57, 200 56"
        fill={color}
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
