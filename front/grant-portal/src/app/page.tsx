import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, DollarSign, Building2 } from "lucide-react";

export default function HomePage() {
  const grants = [
    {
      id: "igp-commercialisation",
      title: "Industry Growth Program: Commercialisation and Growth",
      agency: "Department of Industry, Science and Resources",
      jurisdiction: "Federal",
      description:
        "Support for Australian businesses to commercialize innovative products and services in National Reconstruction Fund priority areas. Grants from $100,000 to $5,000,000 for projects between 12-24 months.",
      fundingRange: "$100,000 - $5,000,000",
      deadline: "Applications accepted year-round",
      sectors: ["Manufacturing", "Renewables", "Medical Science", "Defence"],
      applicationLink: "/applications/igp-commercialisation",
      status: "open",
    },
    {
      id: "bbi-initiative",
      title: "Battery Breakthrough Initiative",
      agency: "Department of Industry, Science and Resources",
      jurisdiction: "Federal",
      description:
        "Support for battery manufacturing and supply chain development in Australia. Coming soon to the Grant Portal.",
      fundingRange: "Varies",
      deadline: "Coming soon",
      sectors: ["Renewables", "Manufacturing"],
      applicationLink: null,
      status: "coming-soon",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Grant Portal</h1>
              <p className="text-sm text-gray-600 mt-1">
                Australian Government Grant Applications
              </p>
            </div>
            <Badge variant="secondary">Phase 1 - Public Preview</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find and Apply for Government Grants
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Streamlined grant application forms for Australian businesses. Your progress is automatically saved so you can complete applications at your own pace.
            </p>
          </div>

          {/* Grants Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Available Grants
              </h3>
              <Badge variant="outline">{grants.length} grants</Badge>
            </div>

            {grants.map((grant) => (
              <Card
                key={grant.id}
                className={grant.status === "coming-soon" ? "opacity-75" : ""}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant={grant.status === "open" ? "default" : "secondary"}
                    >
                      {grant.status === "open" ? "Open" : "Coming Soon"}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{grant.jurisdiction}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{grant.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {grant.agency}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-700 mb-4">{grant.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Funding Range
                        </div>
                        <div className="text-gray-600">{grant.fundingRange}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Deadline</div>
                        <div className="text-gray-600">{grant.deadline}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {grant.sectors.map((sector) => (
                      <Badge key={sector} variant="outline">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  {grant.applicationLink ? (
                    <Link href={grant.applicationLink} className="w-full">
                      <Button className="w-full flex items-center justify-center gap-2">
                        Start Application
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full">
                      Coming Soon
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              How It Works
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✓ Your progress is automatically saved to your browser</li>
              <li>✓ Complete the application in multiple sessions</li>
              <li>✓ All validation rules match the official government requirements</li>
              <li>
                ✓ Phase 2 will add user accounts and collaboration features
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Grant Portal - Phase 1 Public Preview</p>
            <p className="mt-1">
              For demonstration and testing purposes only. Not affiliated with any government agency.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
