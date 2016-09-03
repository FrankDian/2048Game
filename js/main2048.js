/**
 * Created by FrankDian on 2016/08/01
 */

var board= new Array();
var score=0;  //分数
var hasConflicted = new Array();

//监控手机端的滑动
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
	prepareForMobile();
	newGame();
});

//
function prepareForMobile(){
	
	if( documentWidth > 500 ){
		gridContainerWidth = 500;
		cellSideLength = 100 ;
		cellSpace = 20 ;
	}
	
	$("#grid-container").css("width",gridContainerWidth - 2*cellSpace);
	$("#grid-container").css("height",gridContainerWidth - 2*cellSpace);
	$("#grid-container").css("padding",cellSpace);
	$("#grid-container").css("border-radius",0.02*gridContainerWidth);
	
	$(".grid-cell").css("width",cellSideLength);
	$(".grid-cell").css("height",cellSideLength);
	$(".grid-cell").css("border-radius",0.02*cellSideLength);
}

//开始一个新游戏
function newGame(){
	//初始化棋盘格
	init();
	//在随机的两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i=0; i<4;i++){
		for(var j=0; j<4;j++){
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top',getPosTop(i,j));//为小格子设置距顶边值
			gridCell.css('left',getPosLeft(i,j));//为小格子设置距左边值
		}
	}
	
	//初始化数组
	for(var i=0; i<4;i++){
		board[i]=new Array();
		hasConflicted[i] = new Array();
		for(var j=0; j<4;j++){
			board[i][j]=0;
			hasConflicted[i][j] = false;
		}
	}
	
	updateBoardView();
	score = 0;
}

function updateBoardView(){
	$(".number-cell").remove();
	for(var i=0; i<4;i++)
		for(var j=0; j<4;j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $('#number-cell-'+i+'-'+j);
			
			if(board[i][j]==0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2);
				theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2);
			}else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text( board[i][j] );
			}
			
			hasConflicted[i][j]=false;
		}
	$(".number-cell").css("line-height",cellSideLength+'px');
	$(".number-cell").css("font-size",0.6*cellSideLength+'px');
}

function generateOneNumber(){
	//判断是否还有空间
	if(noSpace(board))
		return false;
	//随机一个位置
	var randx = parseInt( Math.floor( Math.random()*4 ) );
	var randy = parseInt( Math.floor( Math.random()*4 ) );
	while(true){
		if(board[randx][randy]==0)
			break;
		randx = parseInt( Math.floor( Math.random()*4 ) );
		randy = parseInt( Math.floor( Math.random()*4 ) );
	}
	//随机一个数字
	var randNumber = Math.random()<0.5 ? 2 : 4 ;
	
	//在随机位置显示随机数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);

	return true;
}

//当按下四个方向键时做出反应
$(document).keydown( function( event ){
    switch( event.keyCode ){
        case 37: //left
        	event.preventDefault();//防止网页的滚动条随着按键滚动
            if( moveLeft() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 38: //up
        	event.preventDefault();
            if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 39: //right
        	event.preventDefault();
            if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 40: //down
        event.preventDefault();
            if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        default: //default
            break;
    }
});

//监控移动端触点坐标
document.addEventListener("touchstart",function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener("touchmove",function(event){
	event.preventDefault();//解决手机触屏的19827问题
});

document.addEventListener("touchend",function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	
	var deltx = endx - startx;
	var delty = endy - starty;
	
	//消除对点击事件的影响
	if(Math.abs(deltx) < 0.3*documentWidth && Math.abs(delty) < 0.3*documentWidth)
		return;
	
	//x轴滑动
	if(Math.abs(deltx) > Math.abs(delty)){
		if(deltx>0){//向右滑动
			if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
		}else{//向左滑动
			 if( moveLeft() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
		}
	}else{//y轴滑动
		if(delty>0){//向下滑动
			if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
		}else{//向上滑动
			if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
		}
	}
});

//判断是否gameOver
function isGameOver(){
	if(noSpace(board) && noMove(board) ){//没有空间了而且所有方块都不能和相邻的融合
		gameOver();
	}
}

//游戏结束时执行
function gameOver(){
	alert('Game Over!!!');
}

function moveLeft(){
	
	if( !canMoveLeft(board) )
		return false;
		
	//可以左移
	for (var i=0; i<4 ; i++) 
		for(var j = 1; j < 4 ; j++){
			if( board[i][j] != 0 ){
				
				for(var k = 0; k < j ; k ++){
					if(board[i][k] == 0 && noBlockHorizontal( i , k , j , board )){ //如果左边全是空格
						//move           
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                        
					}
					else if( board[i][k] == board[i][j] && noBlockHorizontal( i , k , j , board) && !hasConflicted[i][k] ){//如果左边是数值一样的格子
						//move
						showMoveAnimation( i , j , i, k );
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()",200);
	return true;
	
}

function moveRight(){
	if( !canMoveRight( board ) )
        return false;

    //moveRight
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){

                    if( board[i][k] == 0 && noBlockHorizontal( i , j , k , board ) ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board ) && !hasConflicted[i][k] ){
                        //move
                        showMoveAnimation( i , j , i , k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){

    if( !canMoveUp( board ) )
        return false;

    //moveUp
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == 0 && noBlockVertical( j , k , i , board ) ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board ) && !hasConflicted[k][j] ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if( !canMoveDown( board ) )
        return false;

    //moveDown
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){

                    if( board[k][j] == 0 && noBlockVertical( j , i , k , board ) ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board ) && !hasConflicted[k][j] ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}



