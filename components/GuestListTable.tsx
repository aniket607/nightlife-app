"use client"
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StagGuest {
  type: 'stag';
  glId: number;
  guestName: string;
  guestAge: number;
  guestMobile: string;
  guestEmail: string;
  eventId: number;
}

interface CoupleGuest {
  type: 'couple';
  glId: number;
  maleName: string;
  femaleName: string;
  maleAge: number;
  femaleAge: number;
  maleMobile: string;
  femaleMobile: string;
  maleEmail: string;
  femaleEmail: string | null;
  eventId: number;
}

interface GuestListTableProps {
  stagGuests: StagGuest[];
  coupleGuests: CoupleGuest[];
  activeList: 'stag' | 'couple';
}

export default function GuestListTable({ stagGuests, coupleGuests, activeList }: GuestListTableProps) {
  const downloadCSV = () => {
    // Common headers for both types
    const stagHeaders = ["S.No", "Sex", "Name", "Age", "Mobile", "Email"];
    
    // Convert stag guests to rows
    const stagRows = stagGuests.map((guest, index) => [
      index + 1,
      "Male",  // Adding sex for stag guests
      guest.guestName,
      guest.guestAge,
      guest.guestMobile,
      guest.guestEmail,
    ]);

    // Convert couple guests to rows (two rows per couple)
    const coupleRows = coupleGuests.flatMap((guest, index) => [
      // Male row
      [
        index + 1,
        "Male",
        guest.maleName,
        guest.maleAge,
        guest.maleMobile,
        guest.maleEmail,
      ],
      // Female row
      [
        index + 1,
        "Female",
        guest.femaleName,
        guest.femaleAge,
        guest.femaleMobile,
        guest.femaleEmail || '',
      ]
    ]);

    // Combine with spacing between sections
    const csvContent = [
      // Stag section
      "STAG GUESTS",
      stagHeaders.join(","),
      ...stagRows.map(row => row.join(",")),
      "", // Empty line for spacing
      "", // Empty line for spacing
      // Couple section
      "COUPLE GUESTS",
      stagHeaders.join(","),  // Using same headers for consistency
      ...coupleRows.map(row => row.join(","))
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "complete_guestlist.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-5">
        <h1 className="flex items-center gap-3">
          <span className="text-white text-xl sm:text-2xl font-bold font-poppins">
            {activeList === 'stag' ? 'Stag Guest List' : 'Couple Guest List'}
          </span>
          <span className="text-white/40 text-sm sm:text-base font-normal">
            {activeList === 'stag' ? stagGuests.length : coupleGuests.length} guests
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
          Download Complete List
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="min-w-full backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl shadow-xl">
          <TableHeader>
            <TableRow className="border-b border-white/20">
              {activeList === 'stag' ? (
                <>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5">S.No</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5">Name</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5">Age</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5">Mobile</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5">Email</TableCell>
                </>
              ) : (
                <>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5">S.No</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5">Gender</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5">Name</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5">Age</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5">Mobile</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/80 bg-white/5">Email</TableCell>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeList === 'stag' ? (
              stagGuests.map((guest, index) => (
                <TableRow key={guest.glId} className="border-b border-white/10 hover:bg-white/5">
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 text-white/70">{index + 1}</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 text-white/70">{guest.guestName}</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 text-white/70">{guest.guestAge}</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 text-white/70">{guest.guestMobile}</TableCell>
                  <TableCell className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 break-all">{guest.guestEmail}</TableCell>
                </TableRow>
              ))
            ) : (
              coupleGuests.map((guest, index) => (
                <React.Fragment key={guest.glId}>
                  {/* Male Row */}
                  <TableRow className="border-b border-white/10 hover:bg-white/5 group">
                    <TableCell rowSpan={2} className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 align-middle text-center bg-white/5">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-3 sm:px-6 py-2 text-white/70">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                        Male
                      </span>
                    </TableCell>
                    <TableCell className="px-3 sm:px-6 py-2 text-white/70">{guest.maleName}</TableCell>
                    <TableCell className="px-3 sm:px-6 py-2 text-white/70">{guest.maleAge}</TableCell>
                    <TableCell className="px-3 sm:px-6 py-2 text-white/70">{guest.maleMobile}</TableCell>
                    <TableCell className="px-3 sm:px-6 py-2 text-white/70 break-all">{guest.maleEmail}</TableCell>
                  </TableRow>
                  {/* Female Row */}
                  <TableRow className="border-b border-white/10 hover:bg-white/5 group">
                    <TableCell className="px-3 sm:px-6 py-2 text-white/70">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-500/20 text-pink-300">
                        Female
                      </span>
                    </TableCell>
                    <TableCell className="px-3 sm:px-6 py-2 text-white/70">{guest.femaleName}</TableCell>
                    <TableCell className="px-3 sm:px-6 py-2 text-white/70">{guest.femaleAge}</TableCell>
                    <TableCell className="px-3 sm:px-6 py-2 text-white/70">{guest.femaleMobile}</TableCell>
                    <TableCell className="px-3 sm:px-6 py-2 text-white/70 break-all">{guest.femaleEmail}</TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
