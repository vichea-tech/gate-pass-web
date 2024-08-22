"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";
import { useRouter } from "next/navigation";
import type { Dayjs } from "dayjs";
import { Button, Calendar, theme } from 'antd';
import type { CalendarProps } from "antd";
import PptxGenJS from "pptxgenjs";

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<{ status: string; count: number }[]>([]);
  const [totalVisitor, setTotalVisitor] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/login");
      return;
    }
    fetchData();
    countVisitor();
  }, [router]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitor/visitor-status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch visitor data.");
    } finally {
      setLoading(false);
    }
  };

  const countVisitor = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitor`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const { total_visitor, visitors } = response.data;

      // Set data and total count
      setData(visitors.reduce((acc: { status: string; count: number }[], visitor: any) => {
        const existing = acc.find(item => item.status === visitor.status);
        if (existing) {
          existing.count += 1; // Increment count for existing status
        } else {
          acc.push({ status: visitor.status, count: 1 }); // Add new status
        }
        return acc;
      }, []));
      setTotalVisitor(total_visitor);
    } catch (err) {
      setError("Failed to fetch visitor data.");
    } finally {
      setLoading(false);
    }
  };

  const COLORS: { [key: string]: string } = {
    approved: "#008000",
    rejected: "#FF0000",
    pending: "#FFA500"
  };
  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const handleExportPptx = () => {
    // Create a new Presentation
    const pptx = new PptxGenJS();
  
    // Add a slide
    const slide = pptx.addSlide();
  
    // Define static data for the pie chart
    const pieChartData = [
      { name: "Approved", labels: ["Approved"], values: [40] },
      { name: "Rejected", labels: ["Rejected"], values: [30] },
      { name: "Pending", labels: ["Pending"], values: [20] },
      { name: "Others", labels: ["Others"], values: [10] }
    ];
  
    // Add a pie chart to the slide
    slide.addChart("pie", pieChartData, {
      x: 1,
      y: 1.5,
      w: 6,
      h: 3,
      showLegend: true,
      showValue: true
    });    
  
    // Save the presentation
    pptx.writeFile({ fileName: "StaticDataPresentation.pptx" })
      .then(() => console.log("Presentation created successfully!"))
      .catch(err => console.error("Error creating presentation:", err));
  };
  
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-rose-500 mt-[10px]">{error}</p>;

  return (
    <div>
      <div className="flex mt-5 md:flex-row justify-between">
        <div className="bg-transparent w-fit pb-5 shadow-5 rounded-md">
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.status.toLowerCase()] || "#8884d8"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        
        <div style={wrapperStyle} className="mx-auto md:mx-0 h-fit border-none">
          <Calendar fullscreen={false} onPanelChange={onPanelChange} />
        </div>

        <div className="p-7 h-fit rounded-md shadow-14 md:w-fit">
          <h2 className="text-xl font-bold text-center">Total Visitors: {totalVisitor}</h2>
        </div>

      </div>
      <div className="mt-5 text-center">
        <Button type="primary" onClick={handleExportPptx}>
          Export as PPTX
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
