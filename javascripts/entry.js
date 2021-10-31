import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import TransitionGroup from 'react-addons-transition-group'
import { TweenMax } from 'gsap'
import AWSMqttClient from 'aws-mqtt'
import socketIOClient from "socket.io-client";
import 'aws-sdk/dist/aws-sdk'

import './index.css'
import secret from './secrets.js'
import identity from './identity.js'

const AWS = window.AWS
AWS.config.region = 'us-east-2'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: identity
})

const React = require('react')
const ReactDOM = require('react-dom')

const data = [
  { name: 'Food', value: 0, color: '#cedb29' },
  { name: 'Clothing', value: 0, color: '#5cb7b3' },
  { name: 'Travels', value: 0, color: '#146170' },
  { name: 'Purchases', value: 0, color: '#a65a95' },
  { name: 'Living', value: 0, color: '#cb7d31' }
]

class Entry extends React.Component {
  GETInitialVotes () {
    const that = this
    let endpoint = api_url
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => { 
      const { category, computerLocation } = JSON.parse(data)
      that.animateVote(computerLocation, category)
    });
    
    return fetch(api_url + '/vote/api/v1/vote/'+ eventid, {
      method: 'GET',
      headers: new Headers({
        'X-Api-Key': secret
      }),
      mode: 'cors'
    })
      .then(function (res) {
        if (res.ok) {
          return res.json()
        } else {
          throw new TypeError('GETVotes error')
        }
      })
      .then(function (resJSON) {
        let total = 0
        const { currentVotes, iotProperties } = resJSON
        data.map((category, i) => {
          let key = category.name
          let votes = currentVotes[key]
          category.value = votes
          total += votes
          return category
        })
       
        return { data, total }
      }).catch(function (err) {
        console.log(err)
      })
  }

  componentDidMount() {
    this.interval = setInterval(() => this.GETInitialVotes().then(votes => {
      this.setState({
        total: votes.total,
        data: votes.data
      })
    }), 20000)
    
  }

  componentWillMount () {
    this.renderLabel = this.renderLabel.bind(this)
    this.GETInitialVotes = this.GETInitialVotes.bind(this)

    this.setState({
      total: 0,
      data: data,
      showLabels: true,
      voteEnteringFromLeft: false,
      categoryEnteringFromLeft: null,
      voteEnteringFromRight: false,
      categoryEnteringFromRight: null
    })

    this.GETInitialVotes().then(votes => {
      this.setState({
        total: votes.total,
        data: votes.data
      })
    })
  }

  renderLabel (props) {
    return (
      <text
        x={props.x > props.cx ? props.x + 25 : props.x - 25}
        y={props.y > props.cy ? props.y + 25 : props.y - 25}
        textAnchor={props.x > props.cx ? 'start' : 'end'}
        fill={'#fefaeb'}
        style={{
          color: '#fefaeb',
          fontSize: appsettings['labelFontsize'],
          fontFamily: '"Open Sans",Arial,"Helvetica Neue",helvetica,sans-ServiceUIFrameContext',
          //'EksellDisplayWebMedium',
          flexDirection: 'column',
          textAlign: 'center',
          lineHeight: 1.5
        }}
      >
        {this.state.showLabels && props.value > 0 ? this.translate(props.name) : ''}
      </text>)
  }

  translate (name) {
    return lang.categories[name] || ''
  }

  animateVote (direction, category) {
    if (direction === 'Left') {
      this.setState({
        voteEnteringFromLeft: true,
        categoryEnteringFromLeft: category,
        showLabels: false,
      })
    } else {
      this.setState({
        voteEnteringFromRight: true,
        categoryEnteringFromRight: category,
        showLabels: false,
      })
    }
  }

  /**
   * [{"name":"Food","value":1,"color":"#cedb29"}
   * ,{"name":"Clothing","value":1,"color":"#5cb7b3"},
   * {"name":"Travels","value":1,"color":"#146170"},
   * {"name":"Purchases","value":1,"color":"#a65a95"},
   * {"name":"Living","value":1,"color":"#cb7d31"}]
   */
  addVote (direction, category) {
    let updatedData = this.state.data.map((entry, index) => {
      if (entry.name === category) {
        //entry.value = entry.value + 1
      }
      return entry
    })

    if (direction === 'Left') {
      this.setState({
        //total: this.state.total + 1,
        //data: updatedData,
        categoryEnteringFromLeft: null,
        voteEnteringFromLeft: false
      })
    } else {
      this.setState({
        //total: this.state.total + 1,
        //data: updatedData,
        categoryEnteringFromRight: null,
        voteEnteringFromRight: false
      })
    }
  }

  render () {
    return (
      <div className='container'>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: appsettings['screenwidth'],
            height: appsettings['screenheight'],
            background: '#000',
            opacity: 0.3
          }}
        />

        <text
          style={{
            position: 'absolute',
            top: appsettings['headingTop'],
            left: appsettings['headingLeft'],
            color: '#fefaeb',
            fontSize: appsettings['headingFontsize'],
            fontFamily: '"Open Sans",Arial,"Helvetica Neue",helvetica,sans-ServiceUIFrameContext',
            //'EksellDisplayWebMedium',
          }}
        >
          {lang.heading}
        </text>

        <text
          className='pledgeCount'
          textAnchor='middle'
          fill='#82ca9d'
          style={{
            color: '#fefaeb',
            fontSize: appsettings['countNumberFontsize'],
            fontFamily: '"Open Sans",Arial,"Helvetica Neue",helvetica,sans-ServiceUIFrameContext',
            //'EksellDisplayWebMedium',
            flexDirection: 'column',
            textAlign: 'center',
            lineHeight: 1,
            position: 'absolute',
            top: appsettings['screenheight'] / 2 - 20
          }}>
          {this.state.total + '\n'}
          <text style={
            { fontSize: appsettings['countTextFontsize'], 
              display: 'block', 
              lineHeight: 1.3 
            }}>
            {lang.pledges}
          </text>
        </text>
        <ResponsiveContainer width="100%" height={appsettings['screenheight']}>
          <PieChart
            className='chart'
            //width={appsettings['screenwidth']}
            //height={appsettings['screenheight']}
            style={{
              position: 'relative',
              top: appsettings['pieTop']
            }}
          >
            <Pie
              data={this.state.data}
              cx={appsettings['pieCx']}
              cy={appsettings['pieCy']}
              innerRadius={appsettings['innerRadius']}
              outerRadius={appsettings['outerRadius']}
              fill='#82ca9d'
              labelLine={false}
              label={this.renderLabel}
            >
              {
                this.state.data.map((entry, index) =>
                  <Cell
                    key={index}
                    fill={entry.color}
                    stroke={'transparent'}
                  />
                )
              }
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <TransitionGroup>
          { this.state.voteEnteringFromLeft &&
            <Vote
              direction={'Left'}
              enterCallback={() => {
                this.addVote('Left', this.state.categoryEnteringFromLeft)
                this.GETInitialVotes().then(votes => {
                  this.setState({
                    total: votes.total,
                    data: votes.data
                  })
                })
              }}
              category={this.state.categoryEnteringFromLeft}
              exitCallback={() => {
                // console.log('show those labels')
                this.setState({ showLabels: true })
              }}
            />
          }
        </TransitionGroup>

        <TransitionGroup>
          { this.state.voteEnteringFromRight &&
            <Vote
              direction={'Right'}
              enterCallback={() => {
                this.addVote('Right', this.state.categoryEnteringFromRight)
                this.GETInitialVotes().then(votes => {
                  this.setState({
                    total: votes.total,
                    data: votes.data
                  })
                })
              }}
              category={this.state.categoryEnteringFromRight}
              exitCallback={() => { this.setState({ showLabels: true }) }}
            />
          }
        </TransitionGroup>

      </div>
    )
  }
}

class Vote extends React.Component {
  constructor (props) {
    super(props)
    this.enterAnimationComplete = this.enterAnimationComplete.bind(this)
    this.exitAnimationComplete = this.exitAnimationComplete.bind(this)
  }

  enterAnimationComplete (props) {
    this.props.enterCallback()
  }

  exitAnimationComplete (props) {
    this.props.exitCallback()
  }

  componentWillEnter (callback) {
    const el = this.container
    const im = this.image
    TweenMax.fromTo(im, 1, { opacity: 1 }, { opacity: 0 })
    TweenMax.fromTo(el, 1, { y: 500, opacity: 1 }, {
      y: 0,
      opacity: 1,
      onComplete: () => {
        this.enterAnimationComplete()
        callback()
      }
    })
  }

  componentWillLeave (callback) {
    const el = this.container
    if (this.props.direction === 'Left') {
      TweenMax.fromTo(el, 2, { x: 0, opacity: 1, scale: 1 }, {
        x: 700,
        opacity: 1,
        scale: 0,
        onComplete: () => {
          this.exitAnimationComplete()
          callback()
        }
      })
    } else {
      TweenMax.fromTo(el, 2, { x: 0, opacity: 1, scale: 1 }, {
        x: -700,
        opacity: 1,
        scale: 0,
        onComplete: () => {
          this.exitAnimationComplete()
          callback()
        }
      })
    }
  }

  render () {
    return (
      <div
        ref={c => this.container = c}
        style={
          this.props.direction === 'Left' ? {
            position: 'absolute',
            top: 500,
            width: 150,
            height: 150,
            left: 200,
            borderRadius: 75
          } : {
            position: 'absolute',
            top: 500,
            width: 150,
            height: 150,
            right: 200,
            borderRadius: 75
          }
        }>
        {this.props.category === 'Purchases' &&
          <div style={{ backgroundColor: settings['Purchases'].color, borderRadius: 75 }}>
            <img ref={c => this.image = c} style={{ flex: 1 }} src={require(`./assets/${settings['Purchases'].icon}`)} />
          </div>
        }
        {this.props.category === 'Travels' &&
          <div style={{ backgroundColor: settings['Travels'].color, borderRadius: 75 }}>
            <img ref={c => this.image = c} style={{ flex: 1 }} src={require(`./assets/${settings['Travels'].icon}`)} />
          </div>
        }
        {this.props.category === 'Clothing' &&
          <div style={{ backgroundColor: settings['Clothing'].color, borderRadius: 75 }}>
            <img ref={c => this.image = c} style={{ flex: 1 }} src={require(`./assets/${settings['Clothing'].icon}`)} />
          </div>
        }
        {this.props.category === 'Living' &&
          <div style={{ backgroundColor: settings['Living'].color, borderRadius: 75 }}>
            <img ref={c => this.image = c} style={{ flex: 1 }} src={require(`./assets/${settings['Living'].icon}`)} />
          </div>
        }
        {this.props.category === 'Food' &&
          <div style={{ backgroundColor: settings['Food'].color, borderRadius: 75 }}>
            <img ref={c => this.image = c} style={{ flex: 1 }} src={require(`./assets/${settings['Food'].icon}`)} />
          </div>
        }
      </div>
    )
  }
}

ReactDOM.render(<Entry />, document.getElementById('piechart'))
