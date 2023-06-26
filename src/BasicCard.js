import * as React from 'react';
import { Card } from 'antd';
import './App.css'

export default function BasicCard({ title, amount, descriptions, onCardClick, isSelected }) {

  return (
    <div onClick={onCardClick}>
      <Card title={title} bordered={true} hoverable={true} style={{ width: 300, margin: 20, border: isSelected? '2px solid #5469d4' : '1px solid #8a93a0' }} headStyle={{ fontSize: 30, fontWeight: 'bold' }}>
        <p style={{ color: '#8a93a0' }}>Unitmited usage and advanced features</p>

        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', alignSelf: 'flex-end' }}>
          <text style={{ fontSize: 50 }}>${amount}</text>
          <text>/mo</text>
        </div>
        {descriptions.map((value, i) => {
          return (
            <div style={{ display: 'grid', gridTemplateColumns: '0.1fr 1fr', alignItems: 'center' }}>
              <span class="checkmark">
                <div class="checkmark_circle" />
              </span>
              <h2 style={{ fontSize: 13, color: '#8e9094', fontWeight: 'normal' }}>{value}</h2>
            </div>
          )
        })}
      </Card>
    </div>
  );
}