import React from 'react'
import { render } from 'react-dom'
import { Map, TileLayer } from 'react-leaflet'
import HeatmapLayer from '../src/HeatmapLayer'
import { addressPoints } from './realworld.10000.js'

const COLORS = {
  WHITE: '#ffffff',
  BLUE: '#357edd',
  DARK_BLUE: '#00449E',
  NAVY: '#001B44',
  GREEN: '#19a974',
  DARK_GREEN: '#137752',
  RED: '#FF4136',
  DARK_RED: '#E7040F',
  LIGHT_RED: '#FF725C',
  LIGHT_GREEN: '#9EEBCF',
  LIGHT_BLUE: '#96CCFF',
  ORANGE: '#F48120',
  PURPLE: '#A463F2',
  YELLOW: '#FFD700',
  GOLD: '#FFB700',
  BLACK: '#000000',
  BLACK_80: 'rgba(0, 0, 0, 0.8)',
  GRAY: '#777777',
  MOON_GRAY: '#CCCCCC',
  LIGHT_GRAY: '#EEEEEE',
  LIGHT_SILVER: '#AAAAAA',
  TRANSPARENT: 'transparent'
}

const gradient = {
  0.0: COLORS.DARK_BLUE,
  0.25: COLORS.BLUE,
  0.5: COLORS.YELLOW,
  0.7: COLORS.ORANGE,
  0.85: COLORS.LIGHT_RED,
  '1.0': COLORS.RED
}

const gradientReversed = {
  0.0: COLORS.RED,
  0.25: COLORS.LIGHT_RED,
  0.5: COLORS.ORANGE,
  0.7: COLORS.YELLOW,
  0.85: COLORS.BLUE,
  '1.0': COLORS.DARK_BLUE
}

class MapExample extends React.Component {
  state = {
    addressPoints,
    radius: 20,
    blur: 8,
    max: 0.02,
    selectedReadingType: 'temp',
    gradient
  }

  /**
   * Toggle limiting the address points to test behavior with refocusing/zooming when data points change
   */

  render() {
    return (
      <div>
        <Map center={[0, 0]} zoom={13}>
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={this.state.addressPoints}
            longitudeExtractor={m => m[1]}
            latitudeExtractor={m => m[0]}
            gradient={this.state.gradient}
            intensityExtractor={m => {
              const raw = parseFloat(m[2][this.state.selectedReadingType])
              const normalized = raw / 100
              console.log(
                'TYPE: ',
                this.state.selectedReadingType,
                'RAW: ',
                raw,
                'NORMALIZED: ',
                normalized
              )
              return normalized
            }}
            radius={Number(this.state.radius)}
            blur={Number(this.state.blur)}
            max={Number.parseFloat(this.state.max)}
          />
          <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </Map>
        <select
          onChange={e =>
            this.setState({ selectedReadingType: e.currentTarget.value })
          }
        >
          <option value="temp">Temperature</option>
          <option value="hum">Humidity</option>
          <option value="dust">Dust</option>
          <option value="pres">Pressure</option>
        </select>
        <div>
          Invert Gradient
          <input
            style={{ marginLeft: 10 }}
            type="checkbox"
            onChange={e => {
              if (e.target.checked) {
                this.setState({ gradient: gradientReversed })
              } else {
                this.setState({ gradient })
              }
            }}
          />
        </div>
        <div>
          Radius
          <input
            type="range"
            min={1}
            max={100}
            value={this.state.radius}
            onChange={e => this.setState({ radius: e.currentTarget.value })}
          />{' '}
          {this.state.radius}
        </div>

        <div>
          Blur
          <input
            type="range"
            min={5}
            max={100}
            value={this.state.blur}
            onChange={e => this.setState({ blur: e.currentTarget.value })}
          />{' '}
          {this.state.blur}
        </div>

        <div>
          Max
          <input
            type="range"
            min={0.01}
            max={3}
            step={0.01}
            value={this.state.max}
            onChange={e => this.setState({ max: e.currentTarget.value })}
          />{' '}
          {this.state.max}
        </div>
      </div>
    )
  }
}

render(<MapExample />, document.getElementById('app'))
