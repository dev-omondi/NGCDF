import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useApplicantsQuery } from "@/applicationRedux/baseAppslice";
import { useDownloadApplicantsMutation } from "@/downloadRedux/downloadRedux";
import { useGetcyclesQuery } from "@/cycleRedux/cycleBase";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Download,
  Search,
  Users,
  Wallet,
  CalendarDays,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

const LIMIT = 15;

const Approvedpage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [cycleName, setCycleName] = useState("All");

  const {
    data: cycles,
    isLoading: cyclesLoading,
  } = useGetcyclesQuery();
  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useApplicantsQuery({
    status: "Approved",
    page,
    limit: LIMIT,
    search,
    cycleName,
  });

  const [
    downloadApplicants,
    {
      isLoading: downloading,
    },
  ] = useDownloadApplicantsMutation();

  const applicants = data?.data || [];

  const pagination = data?.pagination;

  const stats = useMemo(() => {
    const totalApproved = applicants.length;

    const totalAllocation = applicants.reduce(
      (sum, applicant) => sum + (applicant.ApprovedAmount || 0),
      0
    );

    const currentCycle =
      cycleName === "All"
        ? "All Cycles"
        : cycleName;

    return {
      totalApproved,
      totalAllocation,
      currentCycle,
      cycles:
        cycles?.length || 0,
    };
  }, [applicants, cycleName, cycles]);

  console.log(cycleName)

  const handleDownload = async () => {
    try {
      const blob = await downloadApplicants({
        cycleName:
          cycleName === "All"
            ? ""
            : cycleName,
      }).unwrap();

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        cycleName === "All"
          ? "ApprovedApplicants.xlsx"
          : `${cycleName}-ApprovedApplicants.xlsx`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <Button
                variant="secondary"
                className="mb-5"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />

                Back
              </Button>

              <h1 className="text-4xl font-bold">

                Approved Applicants

              </h1>

              <p className="text-blue-100 mt-2">

                View approved applicants, allocated bursary
                funds and download reports.

              </p>

            </div>

            <Button
              size="lg"
              disabled={downloading}
              onClick={handleDownload}
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              {downloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />

                  Download Excel
                </>
              )}
            </Button>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* QUICK STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          <Card className="shadow-sm">

            <CardContent className="flex items-center justify-between p-6">

              <div>

                <p className="text-sm text-slate-500">

                  Approved Applicants

                </p>

                <h2 className="text-3xl font-bold mt-2">

                  {stats.totalApproved}

                </h2>

              </div>

              <Users className="text-blue-600 h-10 w-10" />

            </CardContent>

          </Card>

          <Card className="shadow-sm">

            <CardContent className="flex items-center justify-between p-6">

              <div>

                <p className="text-sm text-slate-500">

                  Total Allocation

                </p>

                <h2 className="text-3xl font-bold mt-2">

                  KES {stats.totalAllocation.toLocaleString()}

                </h2>

              </div>

              <Wallet className="text-green-600 h-10 w-10" />

            </CardContent>

          </Card>

          <Card className="shadow-sm">

            <CardContent className="flex items-center justify-between p-6">

              <div>

                <p className="text-sm text-slate-500">

                  Current Cycle

                </p>

                <h2 className="text-xl font-bold mt-2">

                  {stats.currentCycle}

                </h2>

              </div>

              <CalendarDays className="text-indigo-600 h-10 w-10" />

            </CardContent>

          </Card>

          <Card className="shadow-sm">

            <CardContent className="flex items-center justify-between p-6">

              <div>

                <p className="text-sm text-slate-500">

                  Available Cycles

                </p>

                <h2 className="text-3xl font-bold mt-2">

                  {stats.cycles}

                </h2>

              </div>

              <BadgeCheck className="text-cyan-600 h-10 w-10" />

            </CardContent>

          </Card>

        </div>

        {/* FILTER BAR */}

        <Card className="mt-8">

          <CardContent className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <div>

                <label className="text-sm font-medium mb-2 block">

                  Cycle

                </label>

                <Select
                  value={cycleName}
                  onValueChange={setCycleName}
                >

                  <SelectTrigger>

                    <SelectValue placeholder="Select Cycle" />

                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="All">

                      All Cycles

                    </SelectItem>

                    {cycles?.map((cycle) => (
                      <SelectItem
                        key={cycle._id}
                        value={cycle.cycleName}
                      >
                        {cycle.cycleName}
                      </SelectItem>
                    ))}

                  </SelectContent>

                </Select>

              </div>

              <div>

                <label className="text-sm font-medium mb-2 block">

                  Search Applicant

                </label>

                <div className="relative">

                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                  <Input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="pl-10"
                    placeholder="Search by name, institution or admission..."
                  />

                </div>

              </div>

              <div className="flex items-end">

                <Button
                  className="w-full bg-blue-700 hover:bg-blue-800"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />

                  Export Approved Applicants

                </Button>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* PART 2 STARTS HERE */}
        {/* =========================
        APPLICANTS TABLE
========================= */}

<Card className="mt-8 shadow-sm border-0">

  <CardContent className="p-0">

    {isLoading || isFetching ? (

      <div className="space-y-4 p-6">

        {Array.from({ length: 10 }).map((_, index) => (

          <Skeleton
            key={index}
            className="h-14 w-full rounded-lg"
          />

        ))}

      </div>

    ) : isError ? (

      <div className="py-24 text-center">

        <h2 className="text-xl font-semibold text-red-600">

          Failed to load applicants

        </h2>

        <p className="text-slate-500 mt-2">

          Please refresh the page and try again.

        </p>

      </div>

    ) : applicants.length === 0 ? (

      <div className="py-24 text-center">

        <Users className="mx-auto h-16 w-16 text-slate-300" />

        <h2 className="text-2xl font-semibold mt-5">

          No Approved Applicants

        </h2>

        <p className="text-slate-500 mt-2">

          There are no approved applicants for the selected cycle.

        </p>

      </div>

    ) : (

      <div className="overflow-x-auto">

        <Table>

          <TableHeader className="bg-slate-100">

            <TableRow>

              <TableHead>#</TableHead>

              <TableHead>Applicant</TableHead>

              <TableHead>Admission No</TableHead>

              <TableHead>Institution</TableHead>

              <TableHead>Ward</TableHead>

              <TableHead>Level</TableHead>

              <TableHead>Fee Balance</TableHead>

              <TableHead>Approved Amount</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Applied On</TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {applicants.map((applicant, index) => (

              <TableRow
                key={applicant._id}
                className="hover:bg-blue-50 transition-colors"
              >

                <TableCell className="font-medium">

                  {(page - 1) * LIMIT + index + 1}

                </TableCell>

                <TableCell>

                  <div>

                    <p className="font-semibold text-slate-800">

                      {applicant.fullName}

                    </p>

                    <p className="text-xs text-slate-500">

                      {applicant.phoneNumber || "No Phone"}

                    </p>

                  </div>

                </TableCell>

                <TableCell>

                  {applicant.admissionNo}

                </TableCell>

                <TableCell>

                  <div>

                    <p className="font-medium">

                      {applicant.institutionName}

                    </p>

                    <p className="text-xs text-slate-500">

                      {applicant.levelOfStudy}

                    </p>

                  </div>

                </TableCell>

                <TableCell>

                  {applicant.ward}

                </TableCell>

                <TableCell>

                  {applicant.levelOfStudy}

                </TableCell>

                <TableCell className="font-medium">

                  KES{" "}

                  {Number(
                    applicant.feeBalance
                  ).toLocaleString()}

                </TableCell>

                <TableCell>

                  <span className="font-bold text-blue-700">

                    KES{" "}

                    {Number(
                      applicant.ApprovedAmount
                    ).toLocaleString()}

                  </span>

                </TableCell>

                <TableCell>

                  <Badge
                    className="bg-green-100 text-green-700 hover:bg-green-100"
                  >

                    {applicant.status}

                  </Badge>

                </TableCell>

                <TableCell>

                  {new Date(
                    applicant.createdAt
                  ).toLocaleDateString()}

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>

    )}

  </CardContent>

</Card>

{/* =========================
        PAGINATION
========================= */}

<div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">

  <div className="text-sm text-slate-600">

    {pagination ? (
      <>
        Showing{" "}
        <span className="font-semibold">
          {(pagination.page - 1) * pagination.limit + 1}
        </span>{" "}
        to{" "}
        <span className="font-semibold">
          {Math.min(
            pagination.page * pagination.limit,
            pagination.total
          )}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {pagination.total}
        </span>{" "}
        approved applicants
      </>
    ) : (
      "No applicants available"
    )}

  </div>

  <div className="flex items-center gap-3">

    <Button
      variant="outline"
      disabled={!pagination?.hasPrevPage}
      onClick={() => setPage((prev) => prev - 1)}
      className="border-blue-200 hover:bg-blue-50"
    >
      Previous
    </Button>

    <div className="px-5 py-2 rounded-lg bg-blue-700 text-white font-medium">

      Page {pagination?.page || 1} of{" "}
      {pagination?.totalPages || 1}

    </div>

    <Button
      disabled={!pagination?.hasNextPage}
      onClick={() => setPage((prev) => prev + 1)}
      className="bg-blue-700 hover:bg-blue-800"
    >
      Next
    </Button>

  </div>

</div>

</div>

</div>

);

};

export default Approvedpage;