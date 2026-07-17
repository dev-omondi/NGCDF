import { useState } from "react";
import { Search,} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

import { useCheckStatusMutation } from "@/applicationRedux/baseAppslice";
import { useGetcyclesQuery } from "@/cycleRedux/cycleBase";

const Statuspage = () => {
  const { data: cycles } = useGetcyclesQuery();

  const [checkStatus, { data, isLoading }] =
    useCheckStatusMutation();

 const [form, setForm] = useState({
                          cycleName: "",
                          searchType: "", 
                          nationalId: "",
                          birthCertNo: "",
                          admissionNo: "",
                        });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
          cycleName: form.cycleName,
          admissionNo: form.admissionNo,
        };

        if (form.searchType === "nationalId") {
          payload.nationalId = form.nationalId;
        } else {
          payload.birthCertNo = form.birthCertNo;
        }

        await checkStatus(payload);
  };

  const badge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-600 hover:bg-green-600">
            Approved
          </Badge>
        );

      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;

      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;

      case "Under-Review":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-500">
            Under Review
          </Badge>
        );

      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">

      <div className="max-w-4xl mx-auto space-y-8">

        <Card className="shadow-xl">

          <CardHeader className="text-center">

            <CardTitle className="text-3xl text-blue-700">

              Check Application Status

            </CardTitle>

            <CardDescription className="text-left text-sm space-y-2">
            <p>
              Use this page to check the current status of your bursary application.
            </p>

            <ol className="list-decimal pl-5 space-y-1">
              <li>Select the bursary application cycle you applied for.</li>
              <li>Select the identification document you used during your application (National ID or Birth Certificate).</li>
              <li>Enter the corresponding document number.</li>
              <li>Enter your admission number exactly as it appears on your admission letter.</li>
              <li>Click <strong>Check Status</strong> to view your application details.</li>
            </ol>

            <p className="text-muted-foreground">
              <strong>Note:</strong> If no record is found, confirm that the application cycle,
              admission number, and identification document details are correct before trying again.
            </p>
          </CardDescription>

          </CardHeader>

          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="font-medium mb-2 block">
                  Application Cycle
                </label>
                <Select
                  value={form.cycleName}
                  onValueChange={(value) =>
                    setForm({
                      ...form,
                      cycleName: value,
                    })
                  }
                >
                  <SelectTrigger>

                    <SelectValue placeholder="Select cycle" />

                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                    <SelectLabel>All CycleNames</SelectLabel>

                    {cycles?.map((cycle) => (
                      <SelectItem
                        key={cycle._id}
                        value={cycle.cycleName}
                      >
                        {cycle.cycleName}
                      </SelectItem>
                    ))}
                    </SelectGroup>

                  </SelectContent>

                </Select>

              </div>
              <div>
                <label className="font-medium mb-2 block">
                  Search Using(IdNo or birthNo,the one you applied with)
                </label>

                <Select
                  value={form.searchType}
                  onValueChange={(value) =>
                    setForm({
                      ...form,
                      searchType: value,
                      nationalId: "",
                      birthCertNo: "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue  placeholder='Select Document Type No'/>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>All Document.Nos</SelectLabel>
                    <SelectItem value="nationalId">
                      National ID Number
                    </SelectItem>

                    <SelectItem value="birthCertNo">
                      Birth Certificate Number
                    </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {form.searchType === "nationalId" ? (
            <div>
              <label className="font-medium mb-2 block">
                National ID Number
              </label>

                  <Input
                    placeholder="Enter National ID Number"
                    value={form.nationalId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nationalId: e.target.value,
                      })
                    }
                  />
                </div>
              ) : (
                <div>
                  <label className="font-medium mb-2 block">
                    Birth Certificate Number
                  </label>

                  <Input
                    placeholder="Enter Birth Certificate Number"
                    value={form.birthCertNo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        birthCertNo: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div>

                <label className="font-medium mb-2 block">
                  Admission Number
                </label>

                <Input
                  placeholder="Enter Admission Number"
                  value={form.admissionNo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      admissionNo: e.target.value,
                    })
                  }
                />

              </div>

              <Button
                className="w-full bg-green-500"
                disabled={isLoading}
              >
                <Search className="mr-2 h-4 w-4" />

                {isLoading
                  ? "Checking..."
                  : "Check Status"}
              </Button>

            </form>

          </CardContent>

        </Card>

        {data?.application && (

          <Card className="shadow-lg">

            <CardHeader>

              <CardTitle>
                Application Details
              </CardTitle>

            </CardHeader>

            <CardContent>

              <div className="grid md:grid-cols-2 gap-6">

                <div>

                  <p className="text-gray-500">
                    Applicant
                  </p>

                  <p className="font-semibold">
                    {data.application.fullname}
                  </p>

                </div>

                <div>

                  <p className="text-gray-500">
                    Institution
                  </p>

                  <p className="font-semibold">
                    {data.application.institutionName}
                  </p>

                </div>

                <div>

                  <p className="text-gray-500">
                    Admission Number
                  </p>

                  <p className="font-semibold">
                    {data.application.admissionNo}
                  </p>

                </div>

                <div>

                  <p className="text-gray-500">
                    Cycle
                  </p>

                  <p className="font-semibold">
                    {data.application.cycleName}
                  </p>

                </div>

                <div>

                  <p className="text-gray-500">
                    Status
                  </p>

                  {badge(data.application.status)}

                </div>

                <div>

                  <p className="text-gray-500">
                    Approved Amount
                  </p>

                  <p className="font-bold text-green-700">
                    KES{" "}
                    {Number(
                      data.application.ApprovedAmount
                    ).toLocaleString()}
                  </p>

                </div>

                <div className="md:col-span-2">

                  <p className="text-gray-500">
                    Remarks
                  </p>

                  <p>
                    {data.application.remarks ||
                      "No remarks available."}
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>

        )}

      </div>

    </div>
  );
};

export default Statuspage;