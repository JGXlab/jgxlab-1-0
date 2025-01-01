import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export const PriceTableDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          View Price Table
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[400px] p-4" align="start">
        <div className="space-y-4">
          <h3 className="font-semibold">Price Table</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left text-sm">Type</th>
                  <th className="px-4 py-2 text-right text-sm">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-2 text-sm">Upper Arch</td>
                  <td className="px-4 py-2 text-right text-sm">₹2000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">Lower Arch</td>
                  <td className="px-4 py-2 text-right text-sm">₹2000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">Dual Arch</td>
                  <td className="px-4 py-2 text-right text-sm">₹3500</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="px-4 py-2 text-sm font-medium">Screw Types</td>
                  <td className="px-4 py-2 text-right text-sm"></td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">DC Screw</td>
                  <td className="px-4 py-2 text-right text-sm">₹500</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">Rosen</td>
                  <td className="px-4 py-2 text-right text-sm">₹600</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">Powerball</td>
                  <td className="px-4 py-2 text-right text-sm">₹700</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">Dess</td>
                  <td className="px-4 py-2 text-right text-sm">₹800</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">SIN</td>
                  <td className="px-4 py-2 text-right text-sm">₹900</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">Neodent</td>
                  <td className="px-4 py-2 text-right text-sm">₹1000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">Others</td>
                  <td className="px-4 py-2 text-right text-sm">Variable</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            * Prices are indicative and may vary based on specific requirements
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};