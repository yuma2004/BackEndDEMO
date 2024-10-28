function showOrHide() {
  //パスワードを表示するか隠すかを判断するプログラム
  let showpass = document.getElementById("pass");
  let check = document.getElementById("showpassword");
  if (check.checked) {
    showpass.type = "text";
  } else {
    showpass.type = "password";
  }
}

let userdata = [
  //必要に応じてここにログイン情報を追加する。例:{name: "user4",age: 24, email: "user4@exam@;e.com" password: "user-4"}
  {
    name: "administrator",
    age: 20,
    email: "Administrator@example.com",
    password: "Administrator",
  },
  { name: "yuya", age: 19, email: "yuya@example.com", password: "123" },
  { name: "user2", age: 22, email: "user2@example.com", password: "user-2" },
  { name: "user3", age: 23, email: "user3@example.com", password: "user-3" },
];

function login() {
  let loginuser = "";
  let username = document.getElementById("username").value;
  let password = document.getElementById("pass").value;

  let found = false;
  let i = 0;

  while (!found && i < userdata.length) {
    //foundがtrueを返すかuserdataのlengthがiより少なくなるまで以下の処理を実行
    loginuser = userdata[i];
    if (
      loginuser.hasOwnProperty("name") &&
      loginuser.hasOwnProperty("password")
    ) {
      //データが破損していないかの確認（参考:chatgpt）
      if (loginuser.name === username && loginuser.password === password) {
        found = true;
      }
    }
    i++;
  }
}
