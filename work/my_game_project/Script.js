//import Start_End from "./start_end.js";
enchant();

const Game_width = 400;
const Game_height = 500;

window.onload = function () {
	var game = new Game(Game_width, Game_height);  				//画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）

	//結果ツイート時にURLを貼るため、このゲームのURLをここに記入
	var url = "https://riest817.github.io/work/my_game_project/index.html";
	url = encodeURI(url); //きちんとURLがツイート画面に反映されるようにエンコードする
	/////////////////////////////////////////////////
	//ゲーム開始前に必要な画像・音を読み込む部分


	//クリック音読み込み
	var ClickSound = "bgm/click.wav";						//game.htmlからの相対パス
	game.preload([ClickSound]); 				//データを読み込んでおく

	//スライムくん画像
	var SlimeImg = "img/slime.png";						//game.htmlからの相対パス
	game.preload([SlimeImg]);					//データを読み込んでおく

	//スタートボタン
	var B_Start = "img/Start.png";						//game.htmlからの相対パス
	game.preload([B_Start]);					//データを読み込んでおく

	//リトライボタン
	var B_Retry = "img/Retry.png";						//game.htmlからの相対パス
	game.preload([B_Retry]);					//データを読み込んでおく

	//ツイートボタン
	var B_Tweet = "img/Tweet.png";						//game.htmlからの相対パス
	game.preload([B_Tweet]);					//データを読み込んでおく		

	//読み込み終わり
	/////////////////////////////////////////////////


	game.onload = function () {					//ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう
		
		/////////////////////////////////////////////////
		//グローバル変数 

		var Point = 0;									//ポイント
		var Stage = -1;								//現在のゲーム状態
		var My_HP = 10;
		var My_MP = 0;
		var Enemy_HP = 5;

		//グローバル変数終わり
		/////////////////////////////////////////////////

		//スタート画面
		var S_START = new Scene();
		S_START.backgroundColor = "blue";
		game.pushScene(S_START);				//S_STARTシーンを読み込ませる

		//GAMESTART
		var S_GameSTARTText = new Label(); 					//テキストはLabelクラス
		S_GameSTARTText.font = "40px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_GameSTARTText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_GameSTARTText.width = Game_width;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_GameSTARTText.moveTo(80, 150);						//移動位置指定
		S_START.addChild(S_GameSTARTText);						//S_STARTシーンにこの画像を埋め込む

		S_GameSTARTText.text = "テストゲーム";	

		//スタートボタン
		var B_START = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		B_START.moveTo(140, 300);						//スタートボタンの位置
		B_START.image = game.assets[B_Start];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_START.addChild(B_START);					//B_STARTにこのスタートボタン画像を貼り付ける  

		B_START.ontouchend = function () {				//B_STARTボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			Stage = 0;
			//game.popScene();						//S_STARシーンを外す
			game.pushScene(S_MAIN);					//S_MAINシーンを入れる
		};

		////////////////////////////////////////////////////////////////

		var S_MAIN = new Scene();					//シーン作成
		S_MAIN.backgroundColor = "black"; 			//S_MAINシーンの背景は黒くした

		//勇者ヒットポイント表示テキスト
		var S_Text = new Label(); 					//テキストはLabelクラス
		S_Text.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_Text.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_Text.width = Game_width;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_Text.moveTo(0, 440);						//移動位置指定
		S_MAIN.addChild(S_Text);					//S_MAINシーンにこの画像を埋め込む
		S_Text.text = "勇者HP：" + My_HP;					//テキストに文字表示 Pointは変数なので、ここの数字が増える

		//勇者マジックポイント表示テキスト
		var M_Text = new Label(); 					//テキストはLabelクラス
		M_Text.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		M_Text.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		M_Text.width = Game_width;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		M_Text.moveTo(0, 470);						//移動位置指定
		S_MAIN.addChild(M_Text);					//S_MAINシーンにこの画像を埋め込む
		M_Text.text = "勇者MP：" + My_MP;					//テキストに文字表示 Pointは変数なので、ここの数字が増える

		//敵ヒットポイント表示テキスト
		var Enemy_Text = new Label(); 					//テキストはLabelクラス
		Enemy_Text.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		Enemy_Text.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		Enemy_Text.width = Game_width;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		Enemy_Text.moveTo(0, 30);						//移動位置指定
		S_MAIN.addChild(Enemy_Text);					//S_MAINシーンにこの画像を埋め込む
		Enemy_Text.text = "敵HP：" + Enemy_HP;					//テキストに文字表示 Pointは変数なので、ここの数字が増える

		//スライムボタン
		var Slime = new Sprite(166, 168);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		Slime.moveTo(118, 100);						//スライムボタンの位置
		Slime.image = game.assets[SlimeImg];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_MAIN.addChild(Slime);					//S_MAINにこの画像を貼り付ける  

		Slime.ontouchend = function () {				//ボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			Point++;									//Pointを1増やす
			game.assets[ClickSound].clone().play();		//クリックの音を鳴らす。

			//クリックしたのでスライムのHPを減らす
			Enemy_HP--;
			Enemy_Text.text = "敵HP：" + Enemy_HP;				//変数が変化するので、毎フレームごとにPointの値を読み込んだ文章を表示する

			//ポイントによって状態Stageを変更する
			if (Point < 3) {
				Stage = 1;
			} else if (Point < 6) {
				Stage = 2;
			} else if (Point < 9) {
				Stage = 3;
			} else if (Point < 12) {
				Stage = 4;
			} else {
				Stage = 5;
			}

			if ( Enemy_HP == 0 ) {
				game.popScene();					//S_MAINシーンを外す
				game.pushScene(S_END);				//S_ENDシーンを読み込ませる
				
			}

		};



		///////////////////////////////////////////////////
		//メインループ　ここに主要な処理をまとめて書こう
		/*
		game.onenterframe = function () {
			if (Stage == 0) { 							//Stage=0のとき、初期セット状態(Pointの状態を０にして)
				Slime.x = -200;						//スライムのｘ座標を指定
				Slime.y = 100;						//スライムのy座標を指定
				Point = 0;  							//point初期化
				Stage = 1;							//ゲームスタート状態に移行
			}
			if (Stage == 1) {							//ゲームスタート　状態１
				Slime.x += 5;
			}
			if (Stage == 2) {							//状態２（Point３以上なら）
				Slime.x += 15;
			}
			if (Stage == 3) {							//状態３（Point６以上から）
				Slime.x += 10;
				Slime.y = 200 + Math.sin(Slime.x / 70) * 100; // ｙ座標を振幅100pxのサイン波で移動(Sinは便利なので慣れとくといいよ！)
			}
			if (Stage == 4) {							//状態４（Point９以上から）　4は初期セット状態（Stage=4）と移動状態（Stage=4.1)の2つに状態をわける		
				Slime.y = Math.random() * 400;			//ｙ座標の位置をランダムに決定
				Stage = 4.1;
			}
			if (Stage == 4.1) {							//状態４．１ 移動状態
				Slime.x += 10;						//ただ移動します
			}
			if (Stage == 5) {							//状態５（Point１２以上から）　 ｙ軸が毎フレーム毎に変化する
				Slime.x += 20;						//移動します。
				Slime.y = Math.random() * 400;			//ｙ座標の位置を枚フレーム毎にランダム決定
			}

			//現在のテキスト表示
			S_Text.text = "現在：" + Point; 				//Point変数が変化するので、毎フレームごとにPointの値を読み込んだ文章を表示する

			//ゲームオーバー判定
			if (Slime.x >= 400) {						//画面端にスライム画像が行ってしまったら
				game.popScene();					//S_MAINシーンを外す
				game.pushScene(S_END);				//S_ENDシーンを読み込ませる

				//ゲームオーバー後のテキスト表示
				S_GameOverText.text = "GAMEOVER 記録：" + Point + "枚";				//テキストに文字表示 
			}

		};*/



		////////////////////////////////////////////////////////////////
		//結果画面
		S_END = new Scene();
		S_END.backgroundColor = "red";

		//GAMEOVER
		var S_GameOverText = new Label(); 					//テキストはLabelクラス
		S_GameOverText.font = "40px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_GameOverText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_GameOverText.width = Game_width;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_GameOverText.moveTo(80, 150);						//移動位置指定
		S_END.addChild(S_GameOverText);						//S_ENDシーンにこの画像を埋め込む
		//ゲームオーバー後のテキスト表示
		S_GameOverText.text = "GAMEOVER";				//テキストに文字表示 


		//リトライボタン
		var S_Retry = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Retry.moveTo(50, 300);						//リトライボタンの位置
		S_Retry.image = game.assets[B_Retry];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_END.addChild(S_Retry);					//S_ENDにこのリトライボタン画像を貼り付ける  

		S_Retry.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			Stage = 0;
			My_HP = 10;
			S_Text.text = "勇者HP：" + My_HP;					//テキストに文字表示 Pointは変数なので、ここの数字が増える
			My_MP = 0;
			M_Text.text = "勇者MP：" + My_MP;					//テキストに文字表示 Pointは変数なので、ここの数字が増える
			Enemy_HP = 5;
			Enemy_Text.text = "敵HP：" + Enemy_HP;					//テキストに文字表示 Pointは変数なので、ここの数字が増える
			game.popScene();						//S_ENDシーンを外す
			game.pushScene(S_MAIN);					//S_MAINシーンを入れる
		};

		//ツイートボタン
		var S_Tweet = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Tweet.moveTo(230, 300);						//リトライボタンの位置
		S_Tweet.image = game.assets[B_Tweet];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_END.addChild(S_Tweet);					//S_ENDにこのリトライボタン画像を貼り付ける  

		S_Tweet.ontouchend = function () {				//S_Tweetボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			//ツイートＡＰＩに送信

			window.open("http://twitter.com/intent/tweet?text=頑張って" + Stage + "ステージまで進出した @qw000q " + url); //ハッシュタグにahogeタグ付くようにした。
		};

	};
	game.start();
};
/*
class Start {
	function start(title) {
		//スタート画面
		var S_START = new Scene();
		S_START.backgroundColor = "red";
		game.pushScene(S_START);				//S_STARTシーンを読み込ませる

		//GAMESTART
		var S_GameSTARTText = new Label(); 					//テキストはLabelクラス
		S_GameSTARTText.font = "40px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_GameSTARTText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_GameSTARTText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_GameSTARTText.moveTo(120, 150);						//移動位置指定
		S_START.addChild(S_GameSTARTText);						//S_STARTシーンにこの画像を埋め込む

		S_GameSTARTText.text = "テストゲーム";	

		//スタートボタン
		var B_START = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		B_START.moveTo(135, 300);						//スタートボタンの位置
		B_START.image = game.assets[B_Start];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_START.addChild(B_START);					//B_STARTにこのスタートボタン画像を貼り付ける  

		B_START.ontouchend = function () {				//B_STARTボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			Stage = 0;
			//game.popScene();						//S_STARシーンを外す
			game.pushScene(S_MAIN);					//S_MAINシーンを入れる
		};
	}
}
*/