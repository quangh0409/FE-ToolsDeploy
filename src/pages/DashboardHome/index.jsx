import React, { PureComponent, useEffect, useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Badge, Breadcrumb, Menu, message } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  Line,
  Legend,
  Label,
  BarChart,
  Bar,
  Rectangle,
  LabelList,
} from "recharts";
import apiCaller from "../../apis/apiCaller";
import vmsApi from "../../apis/vms.api";
import { useSelector } from "react-redux";

export default function DashboardHome() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState();
  const [breadcrumbRepo, setBreadcrumbRepo] = useState([]);
  const [breadcrumbVM, setBreadcrumbVM] = useState([]);
  const [dataRepo, setDataRepo] = useState([]);
  const [dataVM, setDataVM] = useState([]);
  const [dataTableVM, setDataTableVM] = useState([]);
  const [dataAllBranchRepo, setDataAllBranchRepo] = useState([]);
  const vms_ids = useSelector((state) => state.user.ticket.vms_ids);
  const processData = (data) => {
    const result = {
      year: {
        total_success: 0,
        total_failed: 0,
        month: [],
      },
    };

    data.forEach((entry) => {
      const { record, modify_time, status: status_, created_time } = entry;
      let status;

      if (record) {
        status =
          record.status === "SUCCESSFULLY" ? "total_success" : "total_failed";
      } else {
        status = status_ === "SUCCESSFULLY" ? "total_success" : "total_failed";
      }

      const date = new Date(modify_time ? modify_time : created_time);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Months are 0-based
      const day = date.getDate();
      const hour = date.getHours();

      if (!result.year.month[month - 1]) {
        result.year.month[month - 1] = {
          total_success: 0,
          total_failed: 0,
          day: [],
        };
      }
      const monthObj = result.year.month[month - 1];

      if (!monthObj.day[day - 1]) {
        monthObj.day[day - 1] = { total_success: 0, total_failed: 0, hour: [] };
      }
      const dayObj = monthObj.day[day - 1];

      if (!dayObj.hour[hour]) {
        dayObj.hour[hour] = {
          total_success: 0,
          total_failed: 0,
          hour: `${hour}:00`,
        };
      }
      const hourObj = dayObj.hour[hour];

      result.year[status]++;
      monthObj[status]++;
      dayObj[status]++;
      hourObj[status]++;
    });

    return result;
  };
  const itemRepos = repositories?.repos.map((repo, idx) => {
    return {
      key: repo.name,
      label: repo.name,
      children: [
        {
          key: "All of branch",
          label: "All of branch",
          children: [
            {
              key: "2024",
              label: "2024",
              children: [
                { key: "All of month", label: "All of month" },
                ...processData(repo.activities).year.month.map((month, idx) => {
                  if (!!month) {
                    return {
                      key: idx + 1,
                      label: idx + 1,
                      children: [
                        { key: "All of day", label: "All of day" },
                        ...month.day.map((day, i) => {
                          if (!!day) {
                            return {
                              key: i + 1,
                              label: i + 1,
                            };
                          }
                        }),
                      ],
                    };
                  }
                }),
              ],
            },
          ],
        },
        ...repo.branchs.map((branch, i) => {
          if (branch?.name) {
            return {
              key: branch.branch,
              label: branch.branch,
              children: [
                {
                  key: "2024",
                  label: "2024",
                  children: [
                    { key: "All of month", label: "All of month" },
                    ...processData(branch.records).year.month.map(
                      (month, idx) => {
                        if (!!month) {
                          return {
                            key: idx + 1,
                            label: idx + 1,
                            children: [
                              { key: "All of day", label: "All of day" },
                              ...month.day.map((day, i) => {
                                if (!!day) {
                                  return {
                                    key: i + 1,
                                    label: i + 1,
                                  };
                                }
                              }),
                            ],
                          };
                        }
                      }
                    ),
                  ],
                },
              ],
            };
          }
          return false;
        }),
      ],
    };
  });

  const itemVMs = dataVM?.map((vm) => {
    return {
      key: vm.host,
      label: vm.host,
      children: [
        ...vm.years.map((y) => {
          return {
            key: y.year,
            label: y.year,
            children: [
              { key: "All of webapp", label: "All of webapp" },
              ...y.services.map((service) => {
                return {
                  key: service.service_name,
                  label: service.service_name,
                  children: [
                    { key: "All of month", label: "All of month" },
                    ...service.months.map((m) => {
                      return {
                        key: m.month,
                        label: m.month,
                        children: [
                          { key: "All of day", label: "All of day" },
                          ...m.days.map((d) => {
                            return {
                              key: d.day,
                              label: d.day,
                            };
                          }),
                        ],
                      };
                    }),
                  ],
                };
              }),
            ],
          };
        }),
      ],
    };
  });

  const itemRepo = [
    {
      key: "Repository",
      icon: <AppstoreOutlined />,
      label: "Choose repository",
      children: itemRepos,
    },
  ];
  const itemVM = [
    {
      key: "VM-instance",
      icon: <AppstoreOutlined />,
      label: "Choose VM-instance",
      children: itemVMs,
    },
  ];
  const fetch = async () => {
    const res = await apiCaller({
      request: vmsApi.getInfosRepoForDashboard(),
    });
    if (res?.code) {
      message.error(res?.errors[0].message);
    } else {
      setRepositories(res);
    }
  };
  const fetchVM = async (vms) => {
    const res = await apiCaller({
      request: vmsApi.getAllInfoForDashboard(vms),
    });
    if (res?.code) {
      message.error(res?.errors[0].message);
    } else {
      setDataVM(res);
    }
  };
  useEffect(() => {
    fetch();
    fetchVM(vms_ids);
  }, [vms_ids]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-solid shadow-tk rounded-md overflow-hidden px-2 cursor-pointer">
          <div
            className="border-b 
            border-silver p-2 flex items-center gap-2"
          >
            <span className="text-sblue">&#9679;</span>
            <span className="font-semibold text-sblue"></span>
            <span className="font-semibold text-sblue">{label}</span>
          </div>
          <div className="py-2 px-3">
            <p className="grid grid-cols-2  gap-2 w-full mb-3">
              <span className="">&#8226; Total success: </span>
              <span className="bg-sblue font-semibold px-2 text-black text-right rounded-md">
                {`${payload[0].value}`}
              </span>
            </p>
            <p className="grid grid-cols-2  gap-2 w-full mb-3">
              <span className="">&#8226; Total failed: </span>
              <span className="bg-sblue font-semibold px-2 text-black text-right rounded-md">
                {`${payload[1].value}`}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipLine = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <>
          <div className="bg-white shadow-lg rounded-md overflow-hidden px-3 py-1 border border-silver">
            <p className="py-1 border-b border-gray-500 mb-2">
              {payload[0].payload.date}
            </p>
            {payload.map((line, lIndex) => (
              <div key={lIndex}>
                <div className="Ycenter justify-between gap-3 mb-2 flex items-center">
                  <p style={{ color: line.color }} className="font-semibold">
                    {line.name == "total_success" && "success"}
                    {line.name == "total_failed" && "error"}
                    {/* {line.name == "complete" && "Hoàn thành"}
                    {line.name == "cancel" && "Đã huỷ"} */}
                  </p>
                  <p
                    style={{ backgroundColor: line.color }}
                    className="font-semibold px-2 text-white text-right rounded-md"
                  >{`${line.value}`}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className=" w-full flcenter pt-5">
        <div className="Ycenter gap-3 flex items-center justify-center ">
          {payload.map((line, lIndex) => (
            <div key={lIndex} className="Ycenter justify-between gap-3 mb-2">
              <p style={{ color: line.color }} className="font-semibold">
                {line.value === "total_failed" && (
                  <Badge status="error" text="Error" />
                )}
                {line.value === "total_success" && (
                  <Badge status="success" text="Sccuess" />
                )}
                {/* {line.value === "complete" && "Hoàn thành"}
                {line.value === "cancel" && "Đã huỷ"} */}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  function getRandomBrightColor() {
    // Tạo giá trị ngẫu nhiên cho R, G, B trong khoảng từ 128 đến 255 để đảm bảo màu sáng
    const r = Math.floor(Math.random() * 128) + 128;
    const g = Math.floor(Math.random() * 128) + 128;
    const b = Math.floor(Math.random() * 128) + 128;

    // Chuyển đổi giá trị R, G, B sang định dạng hex và đảm bảo có 2 chữ số
    const rHex = r.toString(16).padStart(2, "0");
    const gHex = g.toString(16).padStart(2, "0");
    const bHex = b.toString(16).padStart(2, "0");

    // Kết hợp các giá trị hex để tạo ra màu theo định dạng #RRGGBB
    return `#${rHex}${gHex}${bHex}`;
  }

  function SimpleRevenueBarChart({ dataSet, yLabel }) {
    return (
      <div style={{ width: "100%", height: 400 }} className="">
        <ResponsiveContainer>
          <BarChart
            width={500}
            height={400}
            data={dataSet}
            margin={{
              top: 5,
              right: 30,
              left: 50,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={"name"} angle={0}>
              <Label
                value={
                  "Status statistics chart of deployed branches in the repository"
                }
                offset={-10}
                position="insideBottom"
              />
            </XAxis>
            <YAxis>
              <Label
                value={yLabel}
                offset={-20}
                angle={-90}
                position="insideLeft"
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Bar
              dataKey={"total_success"}
              fill="#FF0000"
              //   activeBar={<Rectangle fill="#F07C00" stroke="blue" />}
              className="cursor-pointer"
              barSize={50}
            >
              <LabelList dataKey="count" position="top" />
            </Bar>
            <Bar
              dataKey={"total_failed"}
              fill="#82ca9d"
              //   activeBar={<Rectangle fill="#F07C00" stroke="blue" />}
              className="cursor-pointer"
              barSize={50}
            >
              <LabelList dataKey="count" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-x-[10%] px-[10%] py-5 border border-solid ">
        <div>
          <div
            className="bg-blue-200 relative border border-blue-500 cursor-pointer py-[5%] rounded-lg overflow-hidden mb-10"
            onClick={() => {
              navigate("/dashboardv2");
            }}
          >
            <p className="text-2xl text-center py-8">Repository</p>
            <div className="absolute w-full bottom-0 left-0 flex items-center justify-between gap-3 px-3 py-3">
              <p>{`Total: ${
                repositories?.total ? repositories.total : "N/A"
              }`}</p>
              <div className="flex items-center gap-3 ">
                <p>{`Deployed: ${
                  repositories?.total_deployed
                    ? repositories.total_deployed
                    : "N/A"
                }`}</p>
                <p>{`Undeployed: ${
                  repositories?.total_undeveloped
                    ? repositories.total_undeveloped
                    : "N/A"
                }`}</p>
              </div>
            </div>
          </div>

          <div>
            <AreaChart
              width={630}
              height={300}
              data={
                repositories?.repos
                  ? repositories.repos.map((repo) => {
                      return {
                        name: repo.name,
                        total_success: repo.total_success,
                        total_failed: repo.total_failed,
                        amt: repo.total_failed + repo.total_success,
                      };
                    })
                  : []
              }
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorfailed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF0000" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorsuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis />

              <XAxis dataKey="name" angle={undefined}>
                <Label
                  value={"Status statistics chart of deployed repositories"}
                  offset={-10}
                  position="insideBottom"
                />
              </XAxis>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Area
                type="monotone"
                dataKey="total_success"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorsuccess)"
              />
              <Area
                type="monotone"
                dataKey="total_failed"
                stroke="#FF0000"
                fillOpacity={1}
                fill="url(#colorfailed)"
              />
            </AreaChart>
          </div>
        </div>
        <div>
          <div
            className="bg-blue-200 relative border border-blue-500 cursor-pointer  py-[5%] rounded-lg overflow-hidden mb-10"
            onClick={() => {
              navigate("/dashboard-vm");
            }}
          >
            <p className="text-2xl text-center py-8">VM-instance</p>
            <div className="absolute w-full bottom-0 left-0 flex items-center justify-between gap-3 px-3 py-3">
              <p>{`Total: ${vms_ids.length > 0 ? vms_ids.length : "N/A"}`}</p>
              <div className="flex items-center gap-3 ">
                <p>{`Used: ${dataVM.length > 0 ? dataVM.length : "N/A"}`}</p>
                <p>{`Unused: ${
                  vms_ids.length > dataVM.length
                    ? vms_ids.length - dataVM.length
                    : "N/A"
                }`}</p>
              </div>
            </div>
          </div>
          <div>
            <AreaChart
              width={630}
              height={300}
              data={
                dataVM?.length > 0
                  ? dataVM.map((vm) => {
                      return {
                        name: vm.host,
                        total_success: vm.total_success,
                        total_failed: vm.total_failed,
                        amt: vm.total_failed + vm.total_success,
                      };
                    })
                  : []
              }
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorfailed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF0000" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorsuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis />

              <XAxis dataKey="name" angle={undefined}>
                <Label
                  value={
                    "The graph shows the number of states when running the pipeline on a VM-instance"
                  }
                  offset={-10}
                  position="insideBottom"
                />
              </XAxis>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Area
                type="monotone"
                dataKey="total_success"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorsuccess)"
              />
              <Area
                type="monotone"
                dataKey="total_failed"
                stroke="#FF0000"
                fillOpacity={1}
                fill="url(#colorfailed)"
              />
            </AreaChart>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-[10%] border border-solid ">
        <div>
          <div className="flex items-center gap-3">
            <Menu
              onClick={(e) => {
                setBreadcrumbRepo(
                  e.keyPath.reverse().map((key) => {
                    return {
                      title: key,
                    };
                  })
                );
                const repo_name = e.keyPath[1];
                const month = e.keyPath.reverse()[1];
                let branch = e.keyPath[2];
                const day = e.keyPath[0];
                if (
                  e.keyPath.includes("All of branch") &&
                  e.keyPath.includes("All of day")
                ) {
                  const data = processData(
                    repositories.repos.find((repo) => repo.name === repo_name)
                      .activities
                  )
                    .year.month[month - 1].day.map((d, i) => {
                      if (!!d)
                        return {
                          date: `${i + 1}-${month}`,
                          total_success: d.total_success,
                          total_failed: d.total_failed,
                        };
                    })
                    .filter(Boolean);
                  setDataRepo(data);
                }
                if (
                  e.keyPath.includes("All of branch") &&
                  e.keyPath.includes("All of month")
                ) {
                  const data = processData(
                    repositories.repos.find((repo) => repo.name === repo_name)
                      .activities
                  )
                    .year.month.map((m, i) => {
                      if (!!m)
                        return {
                          date: `${i + 1}-${month}`,
                          total_success: m.total_success,
                          total_failed: m.total_failed,
                        };
                    })
                    .filter(Boolean);
                  setDataRepo(data);
                }
                if (
                  e.keyPath.includes("All of branch") &&
                  !isNaN(Number.parseInt(month)) &&
                  !isNaN(Number.parseInt(day))
                ) {
                  const data = processData(
                    repositories.repos.find((repo) => repo.name === repo_name)
                      .activities
                  )
                    .year.month[month - 1].day[day - 1].hour.map((h, i) => {
                      if (!!h)
                        return {
                          date: `${h.hour}`,
                          total_success: h.total_success,
                          total_failed: h.total_failed,
                        };
                    })
                    .filter(Boolean);
                  setDataRepo(data);
                }

                if (
                  !e.keyPath.includes("All of branch") &&
                  e.keyPath.includes("All of month")
                ) {
                  const data = processData(
                    repositories.repos
                      .find((repo) => repo.name === repo_name)
                      .branchs.find((b) => b.branch === branch).records
                  )
                    .year.month.map((d, i) => {
                      if (!!d)
                        return {
                          date: `${i + 1}-${month}`,
                          total_success: d.total_success,
                          total_failed: d.total_failed,
                        };
                    })
                    .filter(Boolean);
                  setDataRepo(data);
                }
                branch = e.keyPath[3];
                if (
                  !e.keyPath.includes("All of branch") &&
                  !e.keyPath.includes("All of month") &&
                  e.keyPath.includes("All of day")
                ) {
                  const data = processData(
                    repositories.repos
                      .find((repo) => repo.name === repo_name)
                      .branchs.find((b) => b.branch === branch).records
                  )
                    .year.month[month - 1].day.map((d, i) => {
                      if (!!d)
                        return {
                          date: `${i + 1}-${month}`,
                          total_success: d.total_success,
                          total_failed: d.total_failed,
                        };
                    })
                    .filter(Boolean);
                  setDataRepo(data);
                }

                if (
                  !e.keyPath.includes("All of branch") &&
                  !e.keyPath.includes("All of month") &&
                  !e.keyPath.includes("All of day")
                ) {
                  const data = processData(
                    repositories.repos
                      .find((repo) => repo.name === repo_name)
                      .branchs.find((b) => b.branch === branch).records
                  )
                    .year.month[month - 1].day[day - 1].hour.map((h, i) => {
                      if (!!h)
                        return {
                          date: `${h.hour}`,
                          total_success: h.total_success,
                          total_failed: h.total_failed,
                        };
                    })
                    .filter(Boolean);
                  setDataRepo(data);
                }
                if (e.keyPath.includes("All of branch")) {
                  const data = repositories.repos
                    .find((repo) => repo.name === repo_name)
                    .branchs.map((b) => {
                      if (b?.records) {
                        return {
                          name: b.branch,
                          total_success: b.record_success,
                          total_failed: b.record_error,
                        };
                      }
                    })
                    .filter(Boolean);
                  setDataAllBranchRepo(data);
                }
              }}
              style={{
                width: 200,
              }}
              mode="vertical"
              items={itemRepo}
            />
            <Breadcrumb items={breadcrumbRepo} />
          </div>
          <div>
            <div>
              {dataRepo.length > 0 && (
                <div
                  style={{ width: "100%", height: 400 }}
                  className="pr-10 flex"
                >
                  <ResponsiveContainer>
                    <LineChart
                      data={dataRepo}
                      margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="1 1" vertical={false} />
                      <XAxis
                        dataKey="date"
                        interval={0}
                        tick={{ fontSize: 13 }}
                        // angle={-45}
                        textAnchor="end"
                      >
                        <Label
                          value={
                            "Statistic chart of deployed branches in the repository over time"
                          }
                          offset={-10}
                          position="insideBottom"
                        />
                      </XAxis>
                      <YAxis
                        type="number"
                        domain={[0, "dataMax + 2"]}
                        tickFormatter={(tick) => Math.floor(tick)}
                      >
                        <Label
                          value={""}
                          offset={10}
                          angle={-90}
                          position="insideLeft"
                        />
                      </YAxis>
                      <Tooltip content={<CustomTooltipLine />} />
                      <Legend content={<CustomLegend />} />
                      <Line
                        type="monotone"
                        dataKey="total_failed"
                        stroke="#FF0000"
                        strokeWidth={3}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total_success"
                        stroke="#82ca9d"
                        strokeWidth={3}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <div
            style={{ width: "100%", height: 400 }}
            className="pr-10 pt-[48px] flex"
          >
            {dataAllBranchRepo.length > 0 && (
              <SimpleRevenueBarChart dataSet={dataAllBranchRepo} />
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3">
          <Menu
            items={itemVM}
            onClick={(e) => {
              setBreadcrumbVM(
                e.keyPath.reverse().map((key) => {
                  return {
                    title: key,
                  };
                })
              );
              const host = e.keyPath[1];
              const year = e.keyPath[2];
              const webapp = e.keyPath[3];
              const month = e.keyPath[4];
              const day = e.keyPath[5];
              if (host && year && webapp && webapp === "All of webapp") {
                const data = dataVM
                  .find((vm) => vm.host === host)
                  .years.find((y) => y.year == year)
                  .services.map((s) => {
                    return {
                      date: s.service_name,
                      total_success: s.total_success,
                      total_failed: s.total_failed,
                    };
                  });
                setDataTableVM(data);
              }
              if (host && year && webapp && month === "All of month") {
                const data = dataVM
                  .find((vm) => vm.host === host)
                  .years.find((y) => y.year == year)
                  .services.find((s) => s.service_name === webapp)
                  .months.map((m) => {
                    return {
                      date: `${m.month}-${year}`,
                      total_success: m.total_success,
                      total_failed: m.total_failed,
                      sort: m.month,
                    };
                  })
                  .sort(function (a, b) {
                    return a.sort - b.sort;
                  });
                setDataTableVM(data);
              }
              if (
                host &&
                year &&
                webapp &&
                month &&
                day &&
                day === "All of day"
              ) {
                const data = dataVM
                  .find((vm) => vm.host === host)
                  .years.find((y) => y.year == year)
                  .services.find((s) => s.service_name === webapp)
                  .months.find((m) => m.month == month)
                  .days.map((d) => {
                    return {
                      date: `${d.day}-${month}`,
                      total_success: d.total_success,
                      total_failed: d.total_failed,
                      sort: d.day,
                    };
                  })
                  .sort(function (a, b) {
                    return a.sort - b.sort;
                  });
                setDataTableVM(data);
              }
              if (
                host &&
                year &&
                webapp &&
                month &&
                day &&
                day !== "All of day"
              ) {
                const data = dataVM
                  .find((vm) => vm.host === host)
                  .years.find((y) => y.year == year)
                  .services.find((s) => s.service_name === webapp)
                  .months.find((m) => m.month == month)
                  .days.find((d) => d.day == day)
                  .hours.map((h) => {
                    return {
                      date: `${h.hour}h`,
                      total_success: h.total_success,
                      total_failed: h.total_failed,
                      sort: h.hour,
                    };
                  })
                  .sort(function (a, b) {
                    return a.sort - b.sort;
                  });
                setDataTableVM(data);
              }
            }}
          />
          <Breadcrumb items={breadcrumbVM} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-[5%] border border-solid h-[500px]">
        <div className="col-span-1 flex items-center gap-3 ">
          {dataTableVM.length > 0 && (
            <div style={{ width: "100%", height: 400 }} className="flex">
              <ResponsiveContainer>
                <LineChart
                  data={dataTableVM}
                  margin={{ top: 10, right: 5, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="1 1" vertical={false} />
                  <XAxis
                    dataKey="date"
                    interval={0}
                    tick={{ fontSize: 11 }}
                    // angle={45}
                    textAnchor="end"
                  >
                    <Label
                      value={
                        "Statistic chart of deployed branches in the repository over time"
                      }
                      offset={-10}
                      position="insideBottom"
                    />
                  </XAxis>
                  <YAxis
                    type="number"
                    domain={[0, "dataMax + 2"]}
                    tickFormatter={(tick) => Math.floor(tick)}
                  >
                    <Label
                      value={""}
                      offset={10}
                      angle={-90}
                      position="insideLeft"
                    />
                  </YAxis>
                  <Tooltip content={<CustomTooltipLine />} />
                  <Legend content={<CustomLegend />} />
                  <Line
                    type="monotone"
                    dataKey="total_failed"
                    stroke="#FF0000"
                    strokeWidth={3}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total_success"
                    stroke="#82ca9d"
                    strokeWidth={3}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="col-span-1"></div>
      </div>
    </>
  );
}
