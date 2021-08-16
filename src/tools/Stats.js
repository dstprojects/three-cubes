import { 
    useFrame
  } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import StatsImpl from "stats.js"

export const Stats = () => {
    const [stats] = useState(() => new StatsImpl())
    useEffect(() => {
      stats.showPanel(0)
      document.body.appendChild(stats.dom)
      return () => document.body.removeChild(stats.dom)
    }, [stats])
    return useFrame(state => {
      stats.begin()
      state.gl.render(state.scene, state.camera)
      stats.end()
    }, 1)
}
