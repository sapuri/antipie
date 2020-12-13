import React, { useMemo } from 'react';

type Props = {
  src: string;
};

export const Photo: React.FC<Props> = (props) => {
  return useMemo(() => {
    if (!props.src) {
      return (
        <span>
          <br />
          <br />
        </span>
      );
    }
    return (
      <div className="photo">
        <img src={props.src} alt="" />
      </div>
    );
  }, [props.src]);
};
