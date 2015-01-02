class App
  constructor: ->
    @forms= {
      a: null, b: null, c: null, d: null
    }
    @canvas
    @ctx
    @matrix= {a: 1, b: 0, c: 0, d: 1, det: 1, tr: 2}
    @eigenValue= [1, 1]
    @eigenVector= [[0, 0], [0, 0]]
    @shapeType= 0


  draw: ->
    @ctx.setTransform(1, 0, 0, 1, 0, 0)
    @ctx.clearRect(0, 0, @canvas.width, @canvas.height)

    @ctx.setTransform(@matrix.a, -@matrix.c, @matrix.b, -@matrix.d, @canvas.width * 0.5, @canvas.height * 0.5)

    @ctx.fillStyle = if @matrix.det > 0 then 'rgba(64, 255, 64, 0.9)' else 'rgba(255, 64, 64, 0.9)'

    switch @shapeType
      when 0
        @ctx.beginPath()
        @ctx.fillRect(-100, -100, 200, 200)
        break
      when 1
        @ctx.beginPath()
        @ctx.arc(0, 0, 100, 0, 2 * Math.PI)
        @ctx.fill()
        break

    @ctx.setTransform(1, 0, 0, 1, 0, 0)
    @drawGrid()

    @ctx.setTransform(1, 0, 0, 1, @canvas.width * 0.5, @canvas.height * 0.5)
    @ctx.strokeStyle = 'rgba(64, 64, 255, 0.9)'
    @ctx.lineWidth = 2
    @ctx.beginPath()
    @ctx.moveTo(-50 * @eigenValue[0] * @eigenVector[0][0], 50 * @eigenValue[0] * @eigenVector[0][1])
    @ctx.lineTo(50 * @eigenValue[0] * @eigenVector[0][0], -50 * @eigenValue[0] * @eigenVector[0][1])
    @ctx.stroke()
    @ctx.beginPath()
    @ctx.moveTo(-50 * @eigenValue[1] * @eigenVector[1][0], 50 * @eigenValue[1] * @eigenVector[1][1])
    @ctx.lineTo(50 * @eigenValue[1] * @eigenVector[1][0], -50 * @eigenValue[1] * @eigenVector[1][1])
    @ctx.stroke()


  resize: ->
    @canvas.width = document.documentElement.clientWidth
    @canvas.height = document.documentElement.clientHeight


  drawGrid: ->
    @ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    @ctx.lineWidth = 2
    @ctx.beginPath()
    @ctx.moveTo(@canvas.width * 0.5, 0)
    @ctx.lineTo(@canvas.width * 0.5, @canvas.height)
    @ctx.stroke()
    @ctx.beginPath()
    @ctx.moveTo(0, @canvas.height * 0.5)
    @ctx.lineTo(@canvas.width, @canvas.height * 0.5)
    @ctx.stroke()

    @ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    @ctx.lineWidth = 1

    for i in [1..(@canvas.width / 100)]
      @ctx.beginPath()
      @ctx.moveTo(@canvas.width * 0.5 + 50 * i, 0)
      @ctx.lineTo(@canvas.width * 0.5 + 50 * i, @canvas.height)
      @ctx.stroke()
      @ctx.beginPath()
      @ctx.moveTo(@canvas.width * 0.5 - 50 * i, 0)
      @ctx.lineTo(@canvas.width * 0.5 - 50 * i, @canvas.height)
      @ctx.stroke()

    for i in [1..(@canvas.height / 100)]
      @ctx.beginPath()
      @ctx.moveTo(0, @canvas.height * 0.5 + 50 * i)
      @ctx.lineTo(@canvas.width, @canvas.height * 0.5 + 50 * i)
      @ctx.closePath()
      @ctx.stroke()
      @ctx.beginPath()
      @ctx.moveTo(0, @canvas.height * 0.5 - 50 * i)
      @ctx.lineTo(@canvas.width, @canvas.height * 0.5 - 50 * i)
      @ctx.closePath()
      @ctx.stroke()

  calc: ->
    if isFinite(@forms.a.value) && isFinite(@forms.b.value) && isFinite(@forms.c.value) && isFinite(@forms.d.value)
      @matrix.a = parseFloat(@forms.a.value)
      @matrix.b = parseFloat(@forms.b.value)
      @matrix.c = parseFloat(@forms.c.value)
      @matrix.d = parseFloat(@forms.d.value)
      @matrix.det = @matrix.a * @matrix.d - @matrix.b * @matrix.c
      @matrix.tr = @matrix.a + @matrix.d
      document.getElementById('det').textContent = 'determinant: ' + Math.round(@matrix.det * 1000) / 1000
      document.getElementById('tr').textContent = 'trace: ' + Math.round(@matrix.tr * 1000) / 1000

      discriminant = @matrix.tr * @matrix.tr - 4 * @matrix.det

      if discriminant >= 0
        rootd = Math.sqrt(discriminant)
        if @matrix.b == 0 && @matrix.c == 0
          @eigenValue[0] = @matrix.d
          @eigenValue[1] = @matrix.a
          @eigenVector[0][0] = 0
          @eigenVector[0][1] = 1
          @eigenVector[1][0] = 1
          @eigenVector[1][1] = 0
        else
          @eigenValue[0] = (@matrix.tr + rootd) * 0.5
          @eigenValue[1] = (@matrix.tr - rootd) * 0.5
          @eigenVector[0][0] = @matrix.b / Math.sqrt(@matrix.b * @matrix.b + (@matrix.d - @eigenValue[1]) * (@matrix.d - @eigenValue[1]))
          @eigenVector[0][1] = (@matrix.d - @eigenValue[1]) / Math.sqrt(@matrix.b * @matrix.b + (@matrix.d - @eigenValue[1]) * (@matrix.d - @eigenValue[1]))
          @eigenVector[1][0] = (@matrix.a - @eigenValue[0]) / Math.sqrt(@matrix.c * @matrix.c + (@matrix.a - @eigenValue[0]) * (@matrix.a - @eigenValue[0]))
          @eigenVector[1][1] = @matrix.c / Math.sqrt(@matrix.c * @matrix.c + (@matrix.a - @eigenValue[0]) * (@matrix.a - @eigenValue[0]))

        if (@eigenValue[0] == @eigenValue[1])
          eigenvalueString = 'eigenvalue: ' + Math.round(@eigenValue[0] * 1000) / 1000
        else
          eigenvalueString = 'eigenvalues: ' + Math.round(@eigenValue[0] * 1000) / 1000 + ', ' + Math.round(@eigenValue[1] * 1000) / 1000
        document.getElementById('eigenvalues').textContent = eigenvalueString
        if @matrix.det == 0
          if !isFinite(@eigenVector[0][0]) && isFinite(@eigenVector[1][0])
            @eigenVector[0][0] = @eigenVector[1][0]
            @eigenVector[0][1] = @eigenVector[1][1]
          if isFinite(@eigenVector[0][0]) && !(@matrix.a == 0 && @matrix.b == 0 && @matrix.c == 0 && @matrix.d == 0)
            document.getElementById('eigenvectors').textContent = 'eigenvector: (' + Math.round(@eigenVector[0][0] * 1000) / 1000 + ', ' + Math.round(@eigenVector[0][1] * 1000) / 1000 + ')'
          else
            document.getElementById('eigenvectors').textContent = ''
        else if (@eigenValue[0] == @eigenValue[1])
          if @matrix.a != 0 && @matrix.a == @matrix.d && @matrix.b == 0 && @matrix.c == 0
            document.getElementById('eigenvectors').textContent = 'eigenvectors: any vectors'
          else
            if !isFinite(@eigenVector[0][0]) && isFinite(@eigenVector[1][0])
              @eigenVector[0][0] = @eigenVector[1][0]
              @eigenVector[0][1] = @eigenVector[1][1]
            if isFinite(@eigenVector[0][0])
              document.getElementById('eigenvectors').textContent = 'eigenvector: (' + Math.round(@eigenVector[0][0] * 1000) / 1000 + ', ' + Math.round(@eigenVector[0][1] * 1000) / 1000 + ')'
        else
          if isFinite(@eigenVector[0][0]) && isFinite(@eigenVector[1][0])
            document.getElementById('eigenvectors').textContent = 'eigenvectors: (' + Math.round(@eigenVector[0][0] * 1000) / 1000 + ', ' + Math.round(@eigenVector[0][1] * 1000) / 1000 + '), (' + Math.round(@eigenVector[1][0] * 1000) / 1000 + ', ' + Math.round(@eigenVector[1][1] * 1000) / 1000 + ')'
          else
            if !isFinite(@eigenVector[0][0]) && isFinite(@eigenVector[1][0])
              @eigenVector[0][0] = @eigenVector[1][0]
              @eigenVector[0][1] = @eigenVector[1][1]
            if isFinite(@eigenVector[0][0])
              document.getElementById('eigenvectors').textContent = 'eigenvector: (' + Math.round(@eigenVector[0][0] * 1000) / 1000 + ', ' + Math.round(@eigenVector[0][1] * 1000) / 1000 + ')'
            else
              document.getElementById('eigenvectors').textContent = ''
      else
        rootd = Math.sqrt(-discriminant)
        document.getElementById('eigenvalues').textContent = 'eigenvalues: ' + Math.round(@matrix.tr * 500) / 1000 + ' ±' + Math.round(@matrix.tr * 500) / 1000 + 'i'
        document.getElementById('eigenvectors').textContent = ''
        @eigenValue = [0, 0]
        @eigenVector = [[0, 0], [0, 0]]

    @draw()



window.onload = ->
  window.app = new App()

  window.app.canvas = document.getElementById('canvas')
  window.app.ctx = window.app.canvas.getContext('2d')

  window.app.forms.a = document.getElementById('matrix_a')
  window.app.forms.b = document.getElementById('matrix_b')
  window.app.forms.c = document.getElementById('matrix_c')
  window.app.forms.d = document.getElementById('matrix_d')

  window.app.resize()
  window.app.calc()

  window.app.canvas.addEventListener 'click', ->
    window.app.shapeType++
    if window.app.shapeType == 2
      window.app.shapeType = 0
    window.app.draw()


window.onresize = ->
  window.app.resize()
  window.app.draw()


window.onkeyup = ->
  window.app.calc()
