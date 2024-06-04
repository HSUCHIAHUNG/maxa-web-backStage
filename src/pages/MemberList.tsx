import React, { useRef, useState } from "react";
// ui kit
import {
  Button,
  Form,
  Input,
  Message,
  Modal,
  Pagination,
  Select,
} from "@arco-design/web-react";
import ContentList from "../components/common/ContentList";

// ui kit
const InputSearch = Input.Search;
const TextArea = Input.TextArea;

// 會員列表型別
interface MemberListType {
  id: number;
  name: string;
  mail: string;
  color: string;
}

// 會員列表
const allMembers = [
  { id: 1, name: "張三", mail: "tim.jennings@example.com", color: "red" },
  { id: 2, name: "李四", mail: "susan.smith@example.com", color: "green" },
  { id: 3, name: "王五", mail: "mike.jones@example.com", color: "blue" },
  {
    id: 4,
    name: "趙六",
    mail: "emily.johnson@example.com",
    color: "orange",
  },
  { id: 5, name: "周七", mail: "david.brown@example.com", color: "purple" },
  { id: 6, name: "吳八", mail: "sarah.davis@example.com", color: "pink" },
  { id: 7, name: "鄭九", mail: "chris.wilson@example.com", color: "yellow" },
  { id: 8, name: "馮十", mail: "laura.moore@example.com", color: "brown" },
  { id: 9, name: "陳一", mail: "john.taylor@example.com", color: "cyan" },
  {
    id: 10,
    name: "楊二",
    mail: "emma.anderson@example.com",
    color: "magenta",
  },
  {
    id: 11,
    name: "朱三",
    mail: "james.thomas@example.com",
    color: "lime",
  },
  {
    id: 12,
    name: "秦四",
    mail: "olivia.jackson@example.com",
    color: "teal",
  },
  {
    id: 13,
    name: "尤五",
    mail: "daniel.white@example.com",
    color: "navy",
  },
  { id: 14, name: "許六", mail: "ava.harris@example.com", color: "olive" },
  {
    id: 15,
    name: "何七",
    mail: "ethan.martin@example.com",
    color: "maroon",
  },
  { id: 16, name: "呂八", mail: "mia.lee@example.com", color: "gray" },
  {
    id: 17,
    name: "施九",
    mail: "matthew.young@example.com",
    color: "black",
  },
  { id: 18, name: "張十", mail: "amelia.king@example.com", color: "olive" },
  {
    id: 19,
    name: "范一",
    mail: "alexander.wright@example.com",
    color: "silver",
  },
  {
    id: 20,
    name: "彭二",
    mail: "sophia.walker@example.com",
    color: "gold",
  },
  { id: 21, name: "湯三", mail: "jackson.hall@example.com", color: "coral" },
];

const MemberList: React.FC = () => {
  // ui kit
  const FormItem = Form.Item;
  const [form] = Form.useForm();

  // 分頁切換使用
  const [currentPage, setCurrentPage] = useState(1);

  // 會員列表資料
  const [memberList, setMemberList] = useState(allMembers);

  // 會員詳細資料
  const [visibleMemberProfile, setVisibleMemberProfile] = useState(false);

  // 會員變更密碼
  const [visibleEditPassword, setVisibleEditPassword] = useState(false);

  // 刪除會員模式
  const deleteMenberRef = useRef(false);

  // 搜尋條件
  const searchCriteria = useRef("會員姓名");

  // 會員詳細資料
  const memberProfileRef = useRef({
    name: "",
    mail: "",
    identityId: "-----",
    phone: "(+886) 9123123",
    createDate: "2024-01-01 12:12:12",
    reMark: "",
    isDelete: false,
  });

  // pagination單頁顯示上限
  const pageSize = 10;

  // 切換頁面時更新當前頁面
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 根據當前頁面和每頁顯示數量計算顯示的數據
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return memberList.slice(startIndex, endIndex);
  };

  // 搜尋條件(會員姓名、信箱)
  const changeSearchCriteria = (value: string) => {
    searchCriteria.current = value;
  };

  // 搜尋會員
  const searchMenber = (value: string) => {
    if (value === "") {
      setMemberList(allMembers);
    } else {
      if (searchCriteria.current === "會員姓名") {
        setMemberList(allMembers.filter((item) => item.name.includes(value)));
      } else if (searchCriteria.current === "信箱") {
        setMemberList(allMembers.filter((item) => item.mail.includes(value)));
      }
    }
    setCurrentPage(1); // 重置為第一頁
  };

  // 刪除會員
  function deleteMenber(item: MemberListType) {
    deleteMenberRef.current = true;
    Modal.confirm({
      title: "您確定要刪除會員嗎?",
      content:
        "提醒您，刪除會員後，該會員可能會被強制登出，若未事先通知會員，可能會導致其困擾。",
      okButtonProps: {
        status: "danger",
      },
      onOk: () => {
        console.log(memberProfileRef.current);

        memberProfileRef.current = { ...memberProfileRef.current, ...item };
        console.log(memberProfileRef.current);
        setVisibleMemberProfile(true);
      },
      onCancel: () => {
        deleteMenberRef.current = false;
      },
    });
  }

  // 會員詳細資料
  const memberProfile = (item: MemberListType) => {
    if (item.name !== memberProfileRef.current.name)
      memberProfileRef.current = {
        ...memberProfileRef.current,
        isDelete: false,
      };
    memberProfileRef.current = { ...memberProfileRef.current, ...item };
    setVisibleMemberProfile(true);
  };

  // 變更密碼
  function editPassword() {
    Modal.confirm({
      title: "您確定要修改會員密碼嗎?",
      content:
        "提醒您，修改密碼後，該會員可能會被強制登出，若未事先通知會員，可能會導致其困擾。",
      okButtonProps: {
        status: "danger",
      },
      onOk: () => {
        setVisibleEditPassword(true);
      },
    });
  }

  // 刪除會員-確認刪除
  function confirmDeleteMember() {
    memberProfileRef.current = { ...memberProfileRef.current, isDelete: true };
    setVisibleMemberProfile(false);
    deleteMenberRef.current = false;
    Message.success({
      content: "會員刪除完成",
    });
  }

  // 會員詳細資料關閉moal
  function memberProfileModalClose() {
    deleteMenberRef.current = false;
    setVisibleMemberProfile(false);
  }

  // 變更密碼表單提交
  const submit = () => {
    form.validate().then((res) => {
      console.log(res);
      setVisibleEditPassword(false);
      Message.success({
        content: "修改密碼完成",
      });
      form.resetFields();
    });
  };

  // 變更密碼視窗關閉
  function EditPasswordClose() {
    setVisibleEditPassword(false);
    form.resetFields();
  }

  // 刪除會員成功狀態顯示
  function deleteMemberSucess(name: string) {
    return (
      name === memberProfileRef.current.name &&
      memberProfileRef.current.isDelete
    );
  }

  return (
    <div className={` w-[80%] py-[16px] m-[0_auto] flex flex-col `}>
      {/* 標題、篩選 */}
      <div className={`flex justify-between items-center w-full pb-[16px]`}>
        <p className={`text-[20px] text-[#1D2129]`}>會員列表</p>
        <div className={`flex gap-[8px]`}>
          {/* 訂單編號篩選 */}
          <div className={`w-[360px]`}>
            <Input.Group compact>
              <Select
                onChange={(value) => changeSearchCriteria(value)}
                showSearch
                defaultValue={searchCriteria.current}
                className={`w-[30%]`}
              >
                <Select.Option value="會員姓名">會員姓名</Select.Option>
                <Select.Option value="信箱">信箱</Select.Option>
              </Select>
              <InputSearch
                onSearch={(value) => searchMenber(value)}
                placeholder="Search"
                style={{ width: "70%" }}
              />
            </Input.Group>
          </div>
        </div>
      </div>

      {/* 主內容 */}
      <div className={` border border-solid border-[#E4E6EF] rounded-[8px]  `}>
        {getPaginatedData().map((item) => (
          <div
            key={item.id}
            className={`flex justify-between items-center px-[20px] py-[13px] border-b border-solid border-[#E4E6EF] `}
          >
            {/* 左圖&會員資料 */}
            <div className={`flex gap-[16px] `}>
              <div
                style={{ backgroundColor: item.color }}
                className={` relative flex justify-center items-center w-[40px] h-[40px] rounded-[100px] `}
              >
                <p className={`absolute text-[#fff] `}>{item.name[0]}</p>
              </div>
              <div className={`text-[14px] `}>
                <p className={`pb-[2px]`}>{item.name}</p>
                <p>{item.mail}</p>
              </div>
              {deleteMemberSucess(item.name) && (
                <div className={`flex items-center gap-[8px]`}>
                  <div
                    className={`rounded-[50%] bg-[#C6CCDD] w-[6px] h-[6px]`}
                  ></div>
                  <p>會員已刪除</p>
                </div>
              )}
            </div>

            {/* 右(刪除、詳情、修改) */}
            <div className={`flex gap-[8px]`}>
              {/* 刪除 */}
              <button
                onClick={() => deleteMenber(item)}
                className={` justify-center items-center bg-[#FFEAE8] rounded-[2px] w-[32px] h-[32px] ${
                  deleteMemberSucess(item.name) ? "hidden" : "flex"
                }`}
              >
                <span
                  className={`icon-[jam--trash-f] text-[#EC4A58] w-[16px] h-[16px] `}
                ></span>
              </button>

              {/* 變更密碼 */}
              <button
                onClick={editPassword}
                className={` justify-center items-center bg-[#F2F3F5] rounded-[2px] w-[32px] h-[32px] ${
                  deleteMemberSucess(item.name) ? "hidden" : "flex"
                }`}
              >
                <span
                  className={`icon-[solar--pen-bold-duotone] w-[16px] h-[16px] text-[#4E5969] `}
                ></span>
              </button>

              {/* 詳細資料 */}
              <button
                onClick={() => memberProfile(item)}
                className={` flex justify-center items-center bg-[#F2F3F5] rounded-[2px] w-[32px] h-[32px]`}
              >
                <span
                  className={`icon-[fluent--clipboard-bullet-list-16-filled] w-[16px] h-[16px] text-[#4E5969] `}
                ></span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 分頁控制 */}
      <Pagination
        onChange={(current) => handlePageChange(current)}
        total={memberList.length}
        pageSize={pageSize}
        showTotal={(total) => `共${total}條`}
        className={`self-end pt-[12px]`}
      />

      {/* 會員詳細內容 */}
      <Modal
        title={deleteMenberRef.current ? "刪除會員" : "詳細資料"}
        visible={visibleMemberProfile}
        onOk={() => setVisibleMemberProfile(false)}
        onCancel={memberProfileModalClose}
        autoFocus={false}
        focusLock={true}
        footer={
          deleteMenberRef.current ? (
            <div>
              <Button
                onClick={confirmDeleteMember}
                className={`!bg-[#F53F3F] !text-[#fff] !text-[14px]`}
              >
                確定刪除
              </Button>
              <Button
                onClick={memberProfileModalClose}
                className={`!bg-[#F1F2F8] !text-[##485781] !text-[14px] ml-[8px]`}
              >
                取消
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => {
                setVisibleMemberProfile(false);
              }}
              className={`!bg-[#3A57E8] !text-[#fff] !text-[14px]`}
            >
              ok
            </Button>
          )
        }
      >
        <div
          className={`border border-solid border-[#E5E6EB] rounded-[4px] md:rounded-[8px] overflow-hidden`}
        >
          {/* 姓名 */}
          <ContentList
            title="姓名"
            content={memberProfileRef.current.name}
          ></ContentList>

          {/* 信箱 */}
          <ContentList
            title="信箱"
            content={memberProfileRef.current.mail}
          ></ContentList>

          {/* 身分證或護照號碼 */}
          <ContentList title="身分證或護照號碼" content="-----"></ContentList>

          {/* 電話 */}
          <ContentList title="電話" content="(+886) 9123123"></ContentList>

          {/* 會員創建日期 */}
          <ContentList
            title="會員創建日期"
            content="2024-01-01 12:12:12"
          ></ContentList>
        </div>

        {/* 備註-刪除帳號用 */}
        {deleteMenberRef.current && (
          <>
            <p className={`text-[#485781] mb-[8px] mt-[20px]`}>備註</p>
            <TextArea placeholder="Please enter ..." />
          </>
        )}
      </Modal>

      {/* 變更密碼 */}
      <Modal
        title="修改密碼"
        visible={visibleEditPassword}
        onOk={submit}
        onCancel={EditPasswordClose}
        autoFocus={false}
        focusLock={true}
      >
        <Form
          form={form}
          autoComplete="on"
          requiredSymbol={{ position: "start" }}
          layout="vertical"
          className={``}
        >
          <FormItem label="新密碼" field="password" required>
            <Input.Password placeholder="請輸入新密碼" autoComplete="on" />
          </FormItem>
          <FormItem
            label="確認新密碼"
            field="checkPassword"
            required
            rules={[
              {
                validator: (v, cb) => {
                  if (!v) {
                    return cb("新密碼欄位為必填");
                  } else if (form.getFieldValue("password") !== v) {
                    return cb("新密碼不同");
                  }
                  cb(null);
                },
              },
            ]}
          >
            <Input.Password placeholder="請確認新密碼" autoComplete="on" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberList;
