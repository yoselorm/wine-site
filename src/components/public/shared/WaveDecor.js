import React from 'react';
import waveImg from '../../../assets/images/wine-leaf.png';

const WaveDecor = ({ className = '', src = waveImg }) => (
  <img
    src={src}
    alt=""
    aria-hidden="true"
    className={`pointer-events-none select-none absolute top-8 left-0 w-72 md:w-96 opacity-90 ${className}`}
  />
);

export default WaveDecor;
