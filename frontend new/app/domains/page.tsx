import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const domains = [
  {
    id: 1,
    name: "test domain 1",
    subdomain: "test-domain-1",
    url: "domain1.example.com",
    tag: "health, fitness",
    status: true,
    template: "Microblog.sysrd",
  },
  {
    id: 2,
    name: "test domain 1",
    subdomain: "test-domain-2",
    url: "domain2.example.com",
    tag: "health, fitness",
    status: true,
    template: "Microblog.sysrd",
  },
  {
    id: 3,
    name: "domain4.com",
    subdomain: "domain4",
    url: "-",
    tag: "-",
    status: true,
    template: "Microblog.sysrd",
  },
  {
    id: 4,
    name: "domain5.com",
    subdomain: "domain5.com",
    url: "-",
    tag: "-",
    status: true,
    template: "Minimal.sysrd",
  },
  {
    id: 5,
    name: "domain3.com",
    subdomain: "domain3.com",
    url: "domain3.example.com",
    tag: "games",
    status: true,
    template: "Microblog.sysrd",
  },
  {
    id: 6,
    name: "test domain 6",
    subdomain: "test-domain-6",
    url: "domain6.example.com",
    tag: "health, fitness",
    status: true,
    template: "Microblog.sysrd",
  },
]

export default function DomainsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Domains</h1>
          <p className="text-gray-600 mt-2">Configure and monitor your blog domains</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Domain Folder
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Domain Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">DOMAIN</TableHead>
                  <TableHead className="font-semibold">URL</TableHead>
                  <TableHead className="font-semibold">TAGS</TableHead>
                  <TableHead className="font-semibold">STATUS</TableHead>
                  <TableHead className="font-semibold">TEMPLATE</TableHead>
                  <TableHead className="font-semibold">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow key={domain.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{domain.name}</div>
                        <div className="text-sm text-gray-500">{domain.subdomain}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900">{domain.url}</span>
                        {domain.url !== "-" && <ExternalLink className="h-4 w-4 text-gray-400" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600">{domain.tag}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={domain.status} />
                        <span className="text-sm text-gray-600">{domain.status ? "Active" : "Inactive"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-100">
                        {domain.template}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                          Build
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Domain
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
