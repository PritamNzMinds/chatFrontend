import { Spin } from 'antd'
import React from 'react'

const contentStyle = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};
const content = <div style={contentStyle} />;
const Loading = () => {
  return (
   <Spin tip="Loading" size='large' style={{ textAlign: "center", marginTop: "20%" }}>
        {content}
   </Spin>
  )
}

export default Loading