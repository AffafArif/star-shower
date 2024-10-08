import utils from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Star
class Star {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = {
      x: (Math.random()- 0.5) * 8,
      y: 3
    }
    this.friction = 0.8
    this.gravity = 1
  }

  draw() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    // c.shadowColor ='#E3EAEF'
    // c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()

    //when ball hits bottom of screen
    if ( this.y + this.radius + this.velocity.y > canvas.height - groundHeight ) {
      this.velocity.y = -this.velocity.y *this.friction
      this.shatter() 
    } else {
      this.velocity.y += this.gravity
    }

    //when ball hits sides of the screen
    if (this.x + this.radius + this.velocity.x > canvas.width || this.x -this.radius <=0){
      this.velocity.x= - this.velocity.x *this.friction
      this.shatter()
    }

    this.x += this.velocity.x
    this.y += this.velocity.y
  }

  shatter(){
    this.radius -= 3
    for (let i=0; i<8; i++){
      miniStars.push(new MiniStar(this.x, this.y, 2))
    }
  }
}

class MiniStar extends Star {
  constructor(x, y, radius, color) {
  super( x, y, radius, color)
  this.velocity = {
    x: utils.randomIntFromRange(-5, 5),
    y: utils.randomIntFromRange(-15, 15)
  }
  this.friction = 0.8
  this.gravity = 0.1
  this.ttl = 200
  this.opacity = 1
}

  draw() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(227,234,239, ${this.opacity})` //change colour of miniStar
    c.shadowColor ='#E3EAEF'
    c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()
    //when ball hits bottom of screen
    if ( this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
      this.velocity.y = -this.velocity.y *this.friction 
    } else {
      this.velocity.y += this.gravity
    }
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.ttl -= 1
    this.opacity -= 1/ this.ttl
  }
}

function createMountainRange( mountainAmount, height, color){
  for (let i = 0; i< mountainAmount; i++){
    const mountainWidth = canvas.width / mountainAmount
    c.beginPath()
    c.moveTo(i * mountainWidth, canvas.height)
    c.lineTo(i * mountainWidth + mountainWidth + 350, canvas.height)
    c.lineTo(i * mountainWidth + mountainWidth/2, canvas.height - height)
    c.lineTo(i * mountainWidth - 350 , canvas.height)
    c.fillStyle = color
    c.fill()
    c.closePath()
  }
}


// Implementation
const backgroundGradient = c.createLinearGradient(0,0,0,canvas.height)
backgroundGradient.addColorStop(0,'#171e26') //change colour of background
backgroundGradient.addColorStop(1,'#3f586b')

let stars
let miniStars
let backgroundStars
let ticker = 0
let randomSpawnRate = 75
let groundHeight = 150
function init() {
  stars = []
  miniStars = []
  backgroundStars= []

  // for (let i = 0; i < 1; i++) {
  //   stars.push(new Star(canvas.width / 2,30,30,'#E3EAEf')) //change bigstar colour
  // }

  for (let i = 0; i < 150; i++) {
    const x= Math.random() *canvas.width
    const y= Math.random() *canvas.height
    const radius = Math.random() *3
    backgroundStars.push(new Star(x, y, radius, 'white'))
  }
  
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle=backgroundGradient
  c.fillRect(0, 0, canvas.width, canvas.height)

  backgroundStars.forEach((backgroundStar, index) => {
    backgroundStar.draw()
  })

  createMountainRange(1,canvas.height - 50 ,'#384451') //change mountain colours
  createMountainRange(2,canvas.height - 100,'#2B3843')
  createMountainRange(3,canvas.height - 300,'#26333E')
  createMountainRange(4,canvas.height - 450,'#1D2833')
  c.fillStyle = `#182028`
  c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)


  stars.forEach((star, index) => {
    star.update()
    if (star.radius == 0){
      stars.splice(index, 1)
    }
  })

  miniStars.forEach((miniStar, index) => {
    miniStar.update()
    if (miniStar.ttl == 0){
      miniStars.splice(index, 1)
    }
   })

  ticker++

  if ( ticker % randomSpawnRate == 0 ){
    const radius = 12
    const x = Math.max(Math.random() * canvas.width - radius)
    stars.push ( new Star(x, -100, 12, '#E2EAEF'))
    randomSpawnRate = utils.randomIntFromRange(75,200)
  }
}

init()
animate()
