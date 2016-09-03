/**
 * Created by FrankDian on 2016/08/01
 */
var board= new Array();				//记录每个格子所对应的数字，二维数组
var score=0;  						//分数
var hasConflicted = new Array();	//记录每个格子的状态：在此回合中此格子是否已经融合过了

//监控手机端的滑动
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
	prepareForMobile();		//初始化样式
	newGame();				//开始新游戏
});

//设置4*4格子的样式
function prepareForMobile(){
	
	if( documentWidth > 500 ){  	//若屏宽大于500
		gridContainerWidth = 500;	//格子容器边长
		cellSideLength = 100 ; 		//格子大小
		cellSpace = 20 ;			//格子间距
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

//初始化4*4格子
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
	
	updateBoardView();//更新视图
	score = 0;
	updateScore( score );//更新分数
}

//跟新视图中每个格子的数值
function updateBoardView(){
	$(".number-cell").remove();
	for(var i=0; i<4;i++)
		for(var j=0; j<4;j++){	//给每个格子添加上数值
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $('#number-cell-'+i+'-'+j);
			
			if(board[i][j]==0){	//如果格子的数值为0则不显示
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2);
				theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2);
			}else{				//否则显示
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text( board[i][j] );
			}
			hasConflicted[i][j]=false;//每次重置视图之后，设置此格子在新的一轮中能够融合
		}
	$(".number-cell").css("line-height",cellSideLength+'px');
	$(".number-cell").css("font-size",0.6*cellSideLength+'px');
	
	/*
	 * @author:FrankDian
	 * @date : 2016/09/03
	 * @修复达到1024后数字会溢出bug
	 */
	for(var i=0; i<4;i++)
		for(var j=0; j<4;j++)
			if( board[i][j]>=1024 )
				$('#number-cell-'+i+'-'+j).css("font-size",0.4*cellSideLength+'px');
		
}

//在随机空白格子生成一个数字2或者4
function generateOneNumber(){
	//判断是否还有空间
	if( noSpace(board) )
		return false;
	//随机一个位置
	var randx = parseInt( Math.floor( Math.random()*4 ) );
	var randy = parseInt( Math.floor( Math.random()*4 ) );
	while(true){//判断那个位置是否已经有数字了，如果有了则重新选位置，直到选到的位置没有数字为止
		if(board[randx][randy]==0)
			break;
		randx = parseInt( Math.floor( Math.random()*4 ) );
		randy = parseInt( Math.floor( Math.random()*4 ) );
	}
	//随机一个数字
	var randNumber = Math.random()<0.5 ? 2 : 4 ;
	
	//在随机位置显示随机数字
	board[randx][randy] = randNumber;
	//动画显示新生成的数字
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

//判断是否游戏结束
function isGameOver(){
	//没有空间了而且所有方块都不能和相邻的融合
	if(noSpace(board) && noMove(board) ){
		gameOver();
	}
}

//游戏结束时执行
function gameOver(){
	alert('Game Over!!!');
}

//左移事件
function moveLeft(){
	
	if( !canMoveLeft(board) )
		return false;
		
	//可以左移
	for (var i=0; i<4 ; i++) 
		for(var j = 1; j < 4 ; j++){
			if( board[i][j] != 0 ){
				
				for(var k = 0; k < j ; k ++){
					if(board[i][k] == 0 && noBlockHorizontal( i , k , j , board )){
						//如果左边全是空格
						//从(i,j)移到(i,k)          
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
					}else if( board[i][k] == board[i][j] && noBlockHorizontal( i , k , j , board) && !hasConflicted[i][k] ){
						//如果左边是数值一样的格子,且这个格子在此回合没有被融合过，两个格子之间隔的全是空格
						//move
						showMoveAnimation( i , j , i, k );
                        //数值融合
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //总分增加
                        score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;//设置此回合此格子不能够再次融合了
						continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()",200);
	return true;
	
}

//右移事件
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

//上移事件
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

//下移事件
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



