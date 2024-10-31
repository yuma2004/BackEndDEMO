document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');

  // submit イベント発生時に login 関数を呼び出す
  loginForm.addEventListener('submit', login);

  function login(event) {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ
    const username = usernameInput.value;
    const password = passwordInput.value;
    

    const correctUsername = "1"; // 期待される正しいユーザー名
    const correctPassword = "1"; // 期待される正しいパスワード

    if (username === correctUsername && password === correctPassword) {
      window.location.href = "/html/index.html"; // ログイン後に画面遷移
    } else {
      errorMessage.textContent = 'ユーザー名またはパスワードが間違っています。';
      errorMessage.style.color = 'red'; // エラーメッセージを赤色で表示
    }
  }
});
