const TABLE_RATIO = 0.4;
const BALL_RADIUS = 10;
const ANIMATION_TIME = 1000;
const HOLE_RADIUS = 12;

export class SnookerEngine {
  private ctx;
  private width;
  private height;
  private centerX;
  private centerY;
  private radiusX;
  private radiusY;
  private eccentricity;
  private focus;
  private travelDistance;
  private table;
  private hole;
  private spot;
  private ballX;
  private ballY;
  private animationId?: number;
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.radiusX = width * TABLE_RATIO;
    this.radiusY = height * TABLE_RATIO;
    this.eccentricity = Math.sqrt(1 - this.radiusY ** 2 / this.radiusX ** 2);
    this.focus = Math.sqrt(this.radiusX ** 2 - this.radiusY ** 2);
    this.travelDistance = 2 * Math.sqrt(this.radiusX ** 2 + this.radiusY ** 2);
    this.table = this.createTablePath();
    this.hole = this.createHolePath();
    this.spot = this.createSpotPath();
    this.ballX = this.centerX - this.focus;
    this.ballY = this.centerY;
  }

  createTablePath() {
    const table = new Path2D();
    table.ellipse(
      this.centerX,
      this.centerY,
      this.radiusX + 0.5 * BALL_RADIUS,
      this.radiusY + 0.5 * BALL_RADIUS,
      0,
      0,
      2 * Math.PI
    );
    return table;
  }

  createHolePath() {
    const hole = new Path2D();
    hole.arc(
      this.centerX + this.focus,
      this.centerY,
      HOLE_RADIUS,
      0,
      2 * Math.PI
    );
    return hole;
  }

  createSpotPath() {
    const spot = new Path2D();
    spot.arc(
      this.centerX - this.focus,
      this.centerY,
      BALL_RADIUS / 3,
      0,
      2 * Math.PI
    );
    return spot;
  }

  drawTable() {
    this.ctx.fillStyle = "green";
    this.ctx.fill(this.table);
    this.ctx.strokeStyle = "#0c3f00ff";
    this.ctx.lineWidth = 4;
    this.ctx.stroke(this.table);
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = "black";
    this.ctx.fill(this.hole);
    this.ctx.fillStyle = "gray";
    this.ctx.fill(this.spot);
    this.drawBall();
  }

  drawBall() {
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, BALL_RADIUS, 0, 2 * Math.PI);
    this.ctx.fillStyle = "gold";
    this.ctx.fill();
  }

  hitBall(angle: number) {
    const direction = (angle / 360) * 2 * Math.PI;
    const distanceToEdge = this.getDistanceToEdge(direction);
    return new Promise((resolve, reject) => {
      let start: number;
      const animateBall = (timeStamp: number, direction: number) => {
        if (start === undefined) {
          start = timeStamp;
        }
        const elapsed = timeStamp - start;
        const ballDistance = (elapsed / ANIMATION_TIME) * this.travelDistance;

        [this.ballX, this.ballY] = this.getBallPosition(
          direction,
          ballDistance,
          distanceToEdge
        );
        this.clearCanvas();
        this.drawTable();
        if (this.isInHole() || ballDistance >= this.travelDistance) {
          this.animationId = undefined;
          resolve("done");
          return;
        } else {
          this.animationId = requestAnimationFrame(function (timeStamp) {
            animateBall(timeStamp, direction);
          });
        }
      };

      this.animationId = requestAnimationFrame(function (timeStamp) {
        animateBall(timeStamp, direction);
      });
    });
  }

  getDistanceToEdge(direction: number) {
    return (
      (this.radiusX * (1 - this.eccentricity ** 2)) /
      (1 - this.eccentricity * Math.cos(direction))
    );
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  isInHole() {
    return (
      Math.abs(this.centerX + this.focus - this.ballX) <=
        HOLE_RADIUS - BALL_RADIUS &&
      Math.abs(this.centerY - this.ballY) <= HOLE_RADIUS - BALL_RADIUS
    );
  }

  getBallPosition(
    direction: number,
    ballDistance: number,
    distanceToEdge: number
  ) {
    if (ballDistance <= distanceToEdge) {
      return [
        this.centerX - this.focus + ballDistance * Math.cos(direction),
        this.centerY - ballDistance * Math.sin(direction),
      ];
    } else {
      const distanceToEnd = this.travelDistance - distanceToEdge;
      const remainingDistance = ballDistance - distanceToEdge;
      const startPoint = [
        this.centerX - this.focus + distanceToEdge * Math.cos(direction),
        this.centerY - distanceToEdge * Math.sin(direction),
      ];
      const endPoint = [this.centerX + this.focus, this.centerY];
      return [
        startPoint[0] +
          (remainingDistance / distanceToEnd) * (endPoint[0] - startPoint[0]),

        startPoint[1] +
          (remainingDistance / distanceToEnd) * (endPoint[1] - startPoint[1]),
      ];
    }
  }

  resetTable() {
    this.ballX = this.centerX - this.focus;
    this.ballY = this.centerY;
    this.drawTable();
  }

  cleanUpAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }
  }
}
