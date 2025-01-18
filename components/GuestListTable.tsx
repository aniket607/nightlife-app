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
    <div>
      <div className="flex justify-between mx-32 my-5">
        <h1 className="flex items-center gap-3">
          <span className="text-white text-2xl font-bold font-poppins">
            Guest List
          </span>
          <span className="text-white/40 text-base font-normal">
            {guestlist.length} guests
          </span>
        </h1>
      </div>
      <Table className="w-[80%] backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl shadow-xl m-auto overflow-hidden">
        <TableHeader>
          <TableRow className="border-b border-white/20">
            <TableCell className="px-6 py-4 font-medium text-white/80 bg-white/5">
              S.No
            </TableCell>
            <TableCell className="px-6 py-4 font-medium text-white/80 bg-white/5">
              Name
            </TableCell>
            <TableCell className="px-6 py-4 font-medium text-white/80 bg-white/5">
              Age
            </TableCell>
            <TableCell className="px-6 py-4 font-medium text-white/80 bg-white/5">
              Mobile
            </TableCell>
            <TableCell className="px-6 py-4 font-medium text-white/80 bg-white/5">
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
              <TableCell className="px-6 py-4 text-white/70">
                {index + 1}
              </TableCell>
              <TableCell className="px-6 py-4 text-white/70">
                {item.guestName}
              </TableCell>
              <TableCell className="px-6 py-4 text-white/70">
                {item.guestAge}
              </TableCell>
              <TableCell className="px-6 py-4 text-white/70">
                {item.guestMobile.toString()}
              </TableCell>
              <TableCell className="px-6 py-4 text-white/70">
                {item.guestEmail}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
