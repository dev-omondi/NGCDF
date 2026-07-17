import React, { useState,useEffect,useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Search,
  Users,
  CalendarDays,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  useApplicantsQuery,
  useGetApprovedStatsQuery,
} from "@/applicationRedux/baseAppslice";

import { useGetcyclesQuery } from "@/cycleRedux/cycleBase";

const LIMIT =50;

const Beneficiariespage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [cycleName, setCycleName] =
    useState("All");

  const [applicationYear, setApplicationYear] =
    useState("All");

    useEffect(() => {
    setPage(1);
    }, [search, cycleName, applicationYear]);

  // GET CYCLES
  
  const {
    data: cycles,
    isLoading: cyclesLoading,
  } = useGetcyclesQuery();

  
  // GET APPLICANTS
  

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useApplicantsQuery({
    status: "Approved",
    page,
    limit: LIMIT,
    
  });

 

  const {
    data: stats,
    isLoading: statsLoading,
  } = useGetApprovedStatsQuery(cycleName);

  const applicants = (data?.data || []).filter(
  (applicant) =>
    applicant.status === "Approved" &&
    Number(applicant.ApprovedAmount) > 0
);


  const pagination = data?.pagination;

  
  const applicationYears = useMemo(() => {
    if (!cycles) return [];
    const years = [
      ...new Set(
        cycles.map((cycle) => cycle.financialYear)
      ),
    ];
    return years.sort().reverse();
  }, [cycles]);

    const filtered = applicants.filter((app) => {
  const q = search.toLowerCase();

  const matchesSearch =
    app.fullName?.toLowerCase().includes(q) ||
    app.idNo?.toLowerCase().includes(q) ||
    app.admissionNo?.toLowerCase().includes(q) ||
    app.institutionName?.toLowerCase().includes(q);

  const matchesYear =
    applicationYear === "All"
      ? true
      : app.financialYear === applicationYear;

  const matchesCycle =
    cycleName === "All"
      ? true
      : app.cycleName === cycleName;

  return matchesSearch && matchesYear && matchesCycle;
});
  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO*/}

      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <Button
            variant="secondary"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />

            Back
          </Button>

          <h1 className="text-4xl font-bold">

            Approved Bursary Beneficiaries

          </h1>

          <p className="mt-3 text-blue-100 max-w-3xl">

            Search and view applicants who have
            successfully been awarded bursary
            funding under the Muhoroni NG-CDF
            Bursary Programme.

          </p>

        </div>

      </div>


      <div className="max-w-7xl mx-auto px-6 py-8">


        <Card className="shadow-sm">

          <CardContent className="flex items-center justify-between p-6">

            <div>

              <p className="text-slate-500 text-sm">

                Total Beneficiaries

              </p>

              <h2 className="text-3xl font-bold mt-2">

                {statsLoading ? (

                  <Skeleton className="h-8 w-20" />

                ) : (

                  stats?.totalApproved ?? 0

                )}

              </h2>

            </div>

            <Users className="h-12 w-12 text-blue-700" />

          </CardContent>

        </Card>

        {/*  FILTERS */}

        <Card className="mt-8 shadow-sm">

          <CardContent className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

              {/* SEARCH */}

              <div className="xl:col-span-2">

                <label className="text-sm font-medium mb-2 block">

                  Search Applicant

                </label>

                <div className="relative">

                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                  <Input
                    placeholder="Search by applicant name..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="pl-10"
                  />

                </div>

              </div>

              {/* APPLICATION YEAR */}

              <div>

                <label className="text-sm font-medium mb-2 block">

                  Application Year

                </label>

                <Select
                  value={applicationYear}
                  onValueChange={setApplicationYear}
                >

                  <SelectTrigger>

                    <SelectValue placeholder="Year" />

                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="All">

                      All Years

                    </SelectItem>

                    {applicationYears.map((year) => (

                      <SelectItem
                        key={year}
                        value={year}
                      >
                        {year}
                      </SelectItem>

                    ))}

                  </SelectContent>

                </Select>

              </div>

              {/* CYCLE */}

              <div>

                <label className="text-sm font-medium mb-2 block">

                  Application Cycle

                </label>

                <Select
                  value={cycleName}
                  onValueChange={setCycleName}
                >

                  <SelectTrigger>

                    <SelectValue placeholder="Cycle" />

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

            </div>

          </CardContent>

        </Card>
{/* ==========================
        BENEFICIARIES TABLE
========================== */}

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

        <Users className="mx-auto h-16 w-16 text-red-300" />

        <h2 className="text-2xl font-semibold mt-5 text-red-600">

          Failed to Load Beneficiaries

        </h2>

        <p className="text-slate-500 mt-2">

          Please refresh the page and try again.

        </p>

      </div>

    ) : applicants.length === 0 ? (

      <div className="py-24 text-center">

        <Users className="mx-auto h-16 w-16 text-slate-300" />

        <h2 className="text-2xl font-semibold mt-5">

          No Beneficiaries Found

        </h2>

        <p className="text-slate-500 mt-2">

          Try changing your search or filters.

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

              <TableHead>Application Year</TableHead>

              <TableHead>Cycle</TableHead>

              <TableHead className="text-right">

                Amount Awarded

              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {filtered.map((applicant, index) => (

              <TableRow
                key={applicant._id}
                className="hover:bg-blue-50 odd:bg-white even:bg-slate-50 transition-colors"
              >

                <TableCell className="font-medium">

                  {(page - 1) * LIMIT + index + 1}

                </TableCell>

                <TableCell>

                  <div>

                    <p className="font-semibold text-slate-800">

                      {applicant.fullName}

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

                  </div>

                </TableCell>

                <TableCell>

                  {applicant.ward}

                </TableCell>

                <TableCell>

                  {applicant.levelOfStudy}

                </TableCell>

                <TableCell>

                  {applicant.financialYear}

                </TableCell>

                <TableCell>

                  {applicant.cycleName}

                </TableCell>

                <TableCell className="text-right">

                  <span className="font-bold text-blue-700">

                    KES{" "}

                    {Number(
                      applicant.ApprovedAmount
                    ).toLocaleString()}

                  </span>

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
        beneficiaries
      </>
    ) : (
      "No beneficiaries available"
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

export default Beneficiariespage;