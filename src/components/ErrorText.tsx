import React from 'react';

type Props = {
  msg: string;
};

export const ErrorText: React.FC<Props> = (props) => {
  if (!props.msg) {
    return null;
  }
  return <p className="error">{props.msg} 😓</p>;
};
