import React from 'react'
import cl from './MySocialAccButtonsVK.module.css'
import {BACKED_ADDRESS} from '../../../../../constants/constants'

export default function MySocialAccButtonsVK() {
  return (
    <a href={`http://${BACKED_ADDRESS}/api/auth/vk/login`}>
      <img style={{height: '2rem'}} src={require('./vk2.png')} />
    </a>
  )
}
