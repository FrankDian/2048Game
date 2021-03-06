/**
 * Created by FrankDian on 2016/08/01
 * @description 用来执行游戏中各种判断的工具函数文件
 */
documentWidth = window.screen.availWidth;	//当前空白处屏宽
gridContainerWidth = documentWidth * 0.92;	//整个4*4格子容器的边长，当屏幕宽度小于500px时，取屏幕宽度的0.92
cellSideLength = documentWidth * 0.18;		//格子边长
cellSpace =documentWidth * 0.04;			//格子之间的空隙

//获得格子距离格子容器的顶边距离
function getPosTop(i,j){
	return cellSpace + i * (cellSpace+cellSideLength);
}

//获得格子距离格子容器的左边距离
function getPosLeft(i,j){
	return cellSpace + j * (cellSpace+cellSideLength);
}

//给不同的数值的格子设置不同的颜色
function getNumberBackgroundColor(number){
	switch( number ){
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
    }
	return "black";
}

//获得数字颜色
function getNumberColor(number){
	if( number <= 4)
		return "#776e65";
	return "white";
}

//判断是否还有空间
function noSpace(board){
	for(var i=0; i<4;i++)
		for(var j=0; j<4;j++)
			if(board[i][j]==0)
				return false;//有空间
	return true;//没有空间了
}

//判断是否还能移动
function noMove( board ){
	if(canMoveLeft( board )||
		canMoveRight( board )||
		canMoveUp( board )||
		canMoveDown( board ))
	return false;//还能移动
	return true;//不能移动
}

//判断是否能够左移
function canMoveLeft(board){
	
	for (var i=0; i<4 ; i++) 
		for(var j=1; j<4 ; j++)
			if( board[i][j]!=0 )
				if( board[i][j-1]==0 || board[i][j-1]==board[i][j] ){
					//如果格子和左边的格子相同，或者左边有空格，则返回能够左移
					return true;
				}
	return false;//不能左移
}

//判断是否能够右移
function canMoveRight(board){
	for (var i=0; i<4 ; i++)
		for(var j=2; j>=0 ; j--)
			if( board[i][j]!=0 )
				if( board[i][j+1] == 0 || board[i][j+1] == board[i][j] ){
					//如果格子和右边的格子相同，或者右边有空格，则返回能够右移
					return true;
				}
	return false;
}

//判断是否能够上移
function canMoveUp(board){
	for (var j = 0 ; j < 4 ; j++ ) 
		for(var i = 1 ; i < 4 ; i++)
			if( board[i][j] != 0 )
				if( board[i-1][j] == 0 || board[i-1][j] == board[i][j] ){
					//如果格子和上边的格子相同，或者上边有空格，则返回能够上移
					return true;
				}
	return false;
}

//判断是否能够下移
function canMoveDown(board){
	for (var j = 0 ; j < 4 ; j++) 
		for(var i = 2 ; i >= 0 ; i--)
			if( board[i][j] != 0 )
				if( board[i+1][j]==0 || board[i+1][j] == board[i][j] ){
					//如果格子和下边的格子相同，或下边有空格，则返回能够下移
					return true;
				}
	return false;
}


//判断第row行，第col1列和col2列两个块之间是否全为空格
function noBlockHorizontal(row,col1,col2,board){
	for( var i = col1 + 1 ; i < col2 ; i++ )
		if(board[row][i] != 0 )
			return false;//有障碍物
	return true;	//全为空格
	
}

//判断第col列，第row1行和第row2行两个块之间是否全部为空格
function noBlockVertical(col,row1,row2,board){
	for( var i = row1 + 1 ; i < row2 ; i++)
		if(board[i][col]!=0 )
			return false;//有障碍物
	return true;//全部为空格
}
