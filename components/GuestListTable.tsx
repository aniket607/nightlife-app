"use client"
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Guestlist {
  glId: number;
  guestName: string;
  guestAge: number;
  guestMobile: bigint;
  guestEmail: string;
  eventId: number;
}

interface GuestListTableProps {
  guestlist: Guestlist[];
}

export default function GuestListTable({ guestlist }: GuestListTableProps) {
  const downloadCSV = () => {
    // Convert table data to CSV format
    const headers = ["S.No", "Name", "Age", "Mobile", "Email"];
    const rows = guestlist?.map((item, index) => [
      index + 1,
      item.guestName,
      item.guestAge,
      item.guestMobile.toString(),
      item.guestEmail,
    ]);

    // Create CSV content
    const csvContent =
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    // Create a Blob and URL for download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create an invisible link to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "guestlist.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-5">
        <h1 className="flex items-center gap-3">
          <span className="text-white text-xl sm:text-2xl font-bold font-poppins">
            Guest List
          </span>
          <span className="text-white/40 text-sm sm:text-base font-normal">
            {guestlist.length} guests
          </span>
        </h1>
        <button
          onClick={downloadCSV}
          className="mb-4 px-4 sm:px-6 py-2 backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-lg 
          hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg 
          flex items-center gap-2 text-sm sm:text-base font-medium w-full sm:w-auto justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 sm:h-5 sm:w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
            />
          </svg>
          Download
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="min-w-full backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl shadow-xl">
          <TableHeader>
            <TableRow className="border-b border-white/20">
              <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5 whitespace-nowrap">
                S.No
              </TableCell>
              <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5 whitespace-nowrap">
                Name
              </TableCell>
              <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5 whitespace-nowrap">
                Age
              </TableCell>
              <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5 whitespace-nowrap">
                Mobile
              </TableCell>
              <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5 whitespace-nowrap">
                Email
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guestlist?.map((item, index) => (
              <TableRow
                key={item.glId}
                className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
              >
                <TableCell className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">
                  {index + 1}
                </TableCell>
                <TableCell className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">
                  {item.guestName}
                </TableCell>
                <TableCell className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">
                  {item.guestAge}
                </TableCell>
                <TableCell className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">
                  {item.guestMobile.toString()}
                </TableCell>
                <TableCell className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base break-all">
                  {item.guestEmail}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
