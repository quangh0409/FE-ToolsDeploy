import { Button, Form, Input, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import apiCaller from "../../apis/apiCaller";
import vmsApi from "../../apis/vms.api";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { store } from "../../redux/store";
import { useSelector } from "react-redux";
import ticketApi from "../../apis/ticket.api";

export default function Standard() {
  const [form] = Form.useForm();
  const [isNew, SetIsNew] = useState(false);
  const [standards, SetStandards] = useState([]);
  const onFinish = async (standard) => {
    const res = await apiCaller({
      request: vmsApi.createStandard(standard),
    });
    if (res?.code) {
      message.error(res?.error[0].message);
    } else {
      await apiCaller({
        request: ticketApi.getTicketDetail(),
      });
      message.info("success full");
      SetIsNew(false);
    }
  };
  const ticket_id = useSelector((state) => state.user.ticket.id);
  const standard_ids = useSelector((state) => state.user.ticket.standard_ids);

  useEffect(() => {
    const fetch = async () => {
      const res = await apiCaller({
        request: vmsApi.getStandards(standard_ids),
      });
      SetStandards(res);
    };
    fetch();
  }, [isNew, standard_ids]);

  const columns = [
    {
      title: "NAME",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "RAM",
      key: "ram",
      dataIndex: "ram",
    },
    {
      title: "CPU",
      key: "cpu",
      dataIndex: "cpu",
    },
    {
      title: "CORE",
      key: "core",
      dataIndex: "core",
    },
    {
      title: "OS",
      key: "os",
      dataIndex: "os",
    },
    {
      title: "ARCHITECTURE",
      key: "architecture",
      dataIndex: "architecture",
    },
    {
      title: "Actions",
      render: (record, index) => {
        return (
          <>
            <div>
              <DeleteOutlined
                onClick={async () => {
                  const res = await apiCaller({
                    request: vmsApi.deleteStandard(ticket_id, record.id),
                  });
                  if (res?.code) {
                    message.error(res.errors[0].message);
                  } else {
                    await apiCaller({
                      request: ticketApi.getTicketDetail(),
                    });
                    message.info(res.message);
                  }
                }}
              />
            </div>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex justify-end m-6">
        <Button
          className="flex items-center"
          onClick={() => {
            SetIsNew(true);
          }}
        >
          <PlusOutlined />
          New
        </Button>
      </div>
      {isNew && (
        <div>
          <div className="m-6">
            <Form form={form} onFinish={onFinish}>
              <Form.Item
                name="name"
                label="NAME"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="ram"
                label="RAM"
                rules={[{ required: true, message: "Please input your ram!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="cpu"
                label="CPU"
                rules={[{ required: true, message: "Please input your cpu!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="core"
                label="CORE"
                rules={[{ required: true, message: "Please input your core!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="os"
                label="OS"
                rules={[{ required: true, message: "Please input your os!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="architecture"
                label="ARCHITECTURE"
                rules={[
                  {
                    required: true,
                    message: "Please input your architecture!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <div className="flex gap-2 justify-end">
                <Form.Item>
                  <Button htmlType="submit">create</Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    onClick={() => {
                      SetIsNew(false);
                    }}
                  >
                    cancel
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      )}
      <>
        <div className="mt-11 col-span-1 border rounded-lg h-full overflow-auto min-w-[500]">
          <Table
            pagination={false}
            dataSource={standards.map((s, index) => {
              return {
                ...s,
                key: index,
              };
            })}
            columns={columns}
            scroll={{ y: 421 }}
            // loading={loading}
            className=""
          />
        </div>
      </>
    </>
  );
}
