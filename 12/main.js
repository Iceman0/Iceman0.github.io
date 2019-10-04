var width = $('.field').width();
var ballHeightRatio;
var heightBall;
var count = {countLeft: 0, countRight: 0};
var fieldSide="left";
$('.ball').on('click', function () {
  if (fieldSide === "left") {
    caluclateHeightBall();
    $(".ball").animate({"left": width - $('.ball').height(), "top": heightBall}, "fast", function () {
      isGoal(fieldSide);
    });
    fieldSide = "right";
  }
  else {
    caluclateHeightBall();
    $(".ball").animate({"left": "0px", "top": heightBall}, "fast", function () {
      isGoal(fieldSide);
    });
    fieldSide="left";
  }
});

function isGoal(side) {
    if (ballHeightRatio < 0.517436 && ballHeightRatio > 0.381715) {
      if (side === "left") count.countRight++;
      else count.countLeft++;
      alert("ГОЛ!" + " " + count.countLeft + ":" + count.countRight);
    }
}

function caluclateHeightBall() {
    heightBall = getRandomInt(0, $('.field').height() - $('.ball').height());
    ballHeightRatio = heightBall / $('.field').height();
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}