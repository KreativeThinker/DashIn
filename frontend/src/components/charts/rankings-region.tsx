import {
  Table,
  TableCaption,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/config/api";

interface RankingTableProps {
  field?: string;
  limit?: number;
}

export function RankingTable({ field = "region", limit }: RankingTableProps) {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/rankings/${field}`);
        const data = await response.json();
        setRankings(limit ? data.slice(0, limit) : data);
      } catch (error) {
        console.error("Failed to fetch rankings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [field, limit]);

  return (
    <Table>
      <TableCaption>{field.charAt(0).toUpperCase() + field.slice(1)} Rankings</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>{field.charAt(0).toUpperCase() + field.slice(1)}</TableHead>
          <TableHead className="text-right">Insights</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : rankings.length > 0 ? (
          rankings.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{item[field] ? item[field] : "Uncategorized"}</TableCell>
              <TableCell className="text-right">{item.count}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
