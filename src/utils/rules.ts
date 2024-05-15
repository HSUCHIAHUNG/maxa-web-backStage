interface ValidationRule {
  required?: boolean;
  validator(value: string | undefined, cb: (error?: string) => void): void;
}


// 信箱驗證
const email: ValidationRule[] = [
  {
    required: true,
    validator: (value, callback) => {
      if (!value) {
        callback("請輸入信箱");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        callback("電子郵件格式錯誤");
      }
    },
  },
];

// 密碼驗證
const password: ValidationRule[] = [
  {
    required: true, 
    validator: (value, callback) => {
      if (!value) {
        callback("请输入密码");
      } else if (value.length < 8) {
        callback("密碼長度至少8個英數字");
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        callback("密碼必須包含大小寫字母和数字");
      }
    },
  },
];



export { email, password };
