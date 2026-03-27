import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 10;

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: auditLog, error } = await supabase
    .from('audit_log')
    .select('*, profiles(email)')
    .order('created_at', { ascending: false })
    .range(from, to);

  const { count } = await supabase
    .from('audit_log')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching audit log:', error);
    return <div>Error loading audit log.</div>;
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Audit Log</h1>
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg flex-grow flex flex-col">
        {error ? (
          <p>Error loading audit log.</p>
        ) : (
          <div className="flex-grow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLog.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.profiles?.email || 'System'}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.table_name}</TableCell>
                    <TableCell>{log.record_id}</TableCell>
                    <TableCell>
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex justify-end items-center gap-4 mt-4">
          <span>
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/audit-log?page=${page > 1 ? page - 1 : 1}`}
            passHref
            legacyBehavior
          >
            <Button disabled={page <= 1}>Previous</Button>
          </Link>
          <Link href={`/audit-log?page=${page + 1}`} passHref legacyBehavior>
            <Button disabled={page >= totalPages}>Next</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
