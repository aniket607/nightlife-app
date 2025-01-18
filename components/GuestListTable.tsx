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
        const headers = ["ID", "Name", "Age", "Mobile", "Email"];
        const rows = guestlist?.map((item) => [
          item.glId,
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
    <div>
        <div className="flex justify-between mx-32 my-5">
      <h1 className="text-white text-2xl">Guest List</h1>
      <button
        onClick={downloadCSV}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Download
      </button>
      </div>
      <Table className="w-[80%] border border-gray-300 rounded-lg shadow-md m-auto">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableCell className="px-4 py-2 font-bold text-gray-700 border-b border-gray-300">
              ID
            </TableCell>
            <TableCell className="px-4 py-2 font-bold text-gray-700 border-b border-gray-300">
              Name
            </TableCell>
            <TableCell className="px-4 py-2 font-bold text-gray-700 border-b border-gray-300">
              Age
            </TableCell>
            <TableCell className="px-4 py-2 font-bold text-gray-700 border-b border-gray-300">
              Mobile
            </TableCell>
            <TableCell className="px-4 py-2 font-bold text-gray-700 border-b border-gray-300">
              Email
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guestlist?.map((item) => (
            <TableRow
              key={item.glId}
              className="hover:bg-gray-100 transition-colors border-b border-gray-300"
            >
              <TableCell className="px-4 py-2 text-white">
                {item.glId}
              </TableCell>
              <TableCell className="px-4 py-2 text-white">
                {item.guestName}
              </TableCell>
              <TableCell className="px-4 py-2 text-white">
                {item.guestAge}
              </TableCell>
              <TableCell className="px-4 py-2 text-white">
                {item.guestMobile.toString()}
              </TableCell>
              <TableCell className="px-4 py-2 text-white">
                {item.guestEmail}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
