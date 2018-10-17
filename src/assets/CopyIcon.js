// @flow

import React from 'react'
import Svg, {Path, G} from 'react-native-svg'

import {COLORS} from '../styles/config'

type Props = {
  width: number,
  height: number,
  color?: string,
}

const CopyIcon = ({width, height, color}: Props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 21 22"
    {...{width, height}}
  >
    <G fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
      <G fill={color || COLORS.BLACK} id="Core" transform="translate(-86.000000, -127.000000)">
        <G id="content-copy" transform="translate(86.500000, 127.000000)">
          <Path
            d="M14,0 L2,0 C0.9,0 0,0.9 0,2 L0,16 L2,16 L2,2 L14,2 L14,0 L14,0 Z M17,4
            L6,4 C4.9,4 4,4.9 4,6 L4,20 C4,21.1 4.9,22 6,22 L17,22 C18.1,22 19,21.1
            19,20 L19,6 C19,4.9 18.1,4 17,4 L17,4 Z M17,20 L6,20 L6,6 L17,6 L17,20 L17,20 Z"
            id="Shape"
          />
        </G>
      </G>
    </G>
  </Svg>
)

export default CopyIcon
