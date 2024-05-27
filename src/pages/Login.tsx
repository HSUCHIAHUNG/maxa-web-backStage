import React from "react";
import { useNavigate } from "react-router-dom";
// ui kit
import { Form, Input, Button, Checkbox } from "@arco-design/web-react";
// redux
import { authActions } from "../stores/auth.ts";
import { useAppDispatch } from "../stores/index.ts";
// img
import Logo from "@/assets/images/header/header_text.svg";
// 驗證規則
// import { email, password } from "../utils/rules";

const Login: React.FC = () => {
  // redux
  const dispatch = useAppDispatch();

  // 動態路由
  const navigate = useNavigate();

  // ui kit
  const FormItem = Form.Item;
  const [form] = Form.useForm();

  /** @func login表單提交 */
  const submit = (value: object) => {
    console.log(value);
    dispatch(authActions.isLogin());
    navigate("/");
  };

  return (
    <div className=" fixed top-0 right-0 left-0 bottom-0 bg-[url('../assets/images/login/loginBg.png')] overflow-auto  bg-cover bg-no-repeat">
      <div
        className={` absolute right-[80px] top-[144px] bg-[#fff] w-[420px] h-[466px] rounded-[16px] shadow-md `}
      >
        {/* title */}
        <div className={`flex flex-col items-center justify-center pt-[60px]`}>
          <p className={`text-center py-[8px]`}>歡迎登入</p>
          <img src={Logo} alt="Logo" className={`w-[120px] h-[28px] `} />
        </div>

        {/* form */}
        <div className={`flex flex-col items-center justify-center`}>
          <Form
            form={form}
            autoComplete="off"
            requiredSymbol={{ position: "start" }}
            layout="vertical"
            onSubmit={submit}
            className={` pt-[20px] w-[260px]`}
          >
            <FormItem label="帳號" field="email" required>
              <Input placeholder="Please enter" />
            </FormItem>
            <FormItem label="密碼" field="password" required>
              <Input.Password
                placeholder="Please enter password"
                autoComplete="on"
              />
            </FormItem>
            <FormItem field="rememberPassword" required className={``}>
              <Checkbox value="記住密碼">記住密碼</Checkbox>
            </FormItem>
            <FormItem className={``}>
              <Button
                className={`w-[100%] !bg-[#3A57E8]`}
                type="primary"
                htmlType="submit"
              >
                登入
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
