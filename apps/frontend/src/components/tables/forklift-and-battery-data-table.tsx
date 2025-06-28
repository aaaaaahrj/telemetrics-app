"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  MoreVerticalIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Forklift } from "@/app/(dashboard)/forklifts-data";
import { BatteryData } from "@/app/(dashboard)/battery-data";

// Define a new schema for battery data
export const batterySchema = z.object({
  id: z.string().uuid(),
  info: z.string(),
  device_status: z.string(),
  battery_type: z.string(),
  total_work_hour: z.number(),
  last_on: z.date(),
  release_date: z.date(),
});

export const forkliftSchema = z.object({
  id: z.string().uuid(),
  vin: z.string(),
  status: z.string(),
  holder_id: z.string(),
  registered_by: z.string(),
  registered_at: z.date(),
});

const columns: ColumnDef<z.infer<typeof batterySchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "info",
    header: "Info",
    cell: ({ row }) => <TableCellViewer item={row.original} />, // You can customize this as needed
    enableHiding: false,
  },
  {
    accessorKey: "device_status",
    header: "Device Status",
    cell: ({ row }) => (
      <Badge
        variant='outline'
        className='flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 capitalize'
      >
        {row.original.device_status}
      </Badge>
    ),
  },
  {
    accessorKey: "battery_type",
    header: "Battery Type",
    cell: ({ row }) => <div>{row.original.battery_type}</div>,
  },
  {
    accessorKey: "total_work_hour",
    header: "Total Work Hour",
    cell: ({ row }) => <div>{row.original.total_work_hour}</div>,
  },
  {
    accessorKey: "last_on",
    header: "Last On",
    cell: ({ row }) => {
      const raw = row.original.last_on;
      const dt = raw ? new Date(raw) : undefined;
      return (
        <div className='w-full text-center'>
          {dt && !isNaN(dt.getTime()) ? (
            <>
              {dt.toLocaleDateString()}{" "}
              <span className='text-xs text-muted-foreground'>
                {dt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          ) : (
            <span className='text-muted-foreground'>-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "release_date",
    header: "Release Date",
    cell: ({ row }) => {
      const dt = row.original.release_date as Date;
      return (
        <div className='w-full text-center'>
          {dt && !isNaN(dt.getTime()) ? (
            <>
              {dt.toLocaleDateString()}{" "}
              <span className='text-xs text-muted-foreground'>
                {dt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          ) : (
            <span className='text-muted-foreground'>-</span>
          )}
        </div>
      );
    },
  },
];

const forkliftColumns: ColumnDef<z.infer<typeof forkliftSchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "vin",
    header: "VIN",
    cell: ({ row }) => row.original.vin,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant='outline'
        className='flex gap-1 px-1.5 text-muted-foreground capitalize'
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "holder_id",
    header: "Holder ID",
    cell: ({ row }) => row.original.holder_id,
  },
  {
    accessorKey: "registered_by",
    header: "Registered By",
    cell: ({ row }) => row.original.registered_by,
  },
  {
    accessorKey: "registered_at",
    header: "Registered At",
    cell: ({ row }) => {
      const dt = row.original.registered_at as Date;
      return (
        <div className='w-full text-center'>
          {dt && !isNaN(dt.getTime()) ? (
            <>
              {dt.toLocaleDateString()}{" "}
              <span className='text-xs text-muted-foreground'>
                {dt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          ) : (
            <span className='text-muted-foreground'>-</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex size-8 text-muted-foreground data-[state=open]:bg-muted'
            size='icon'
          >
            <MoreVerticalIcon />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuItem>View Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function DataTable({
  forkliftData,
  batteryData,
  showTabsList = false,
}: {
  forkliftData: Forklift[];
  batteryData: BatteryData[];
  showTabsList?: boolean;
}) {
  const [tab, setTab] = React.useState<'forklifts' | 'battery'>('forklifts');
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const forkliftTable = useReactTable<Forklift>({
    data: forkliftData,
    columns: forkliftColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Battery table instance
  const batteryTable = useReactTable<BatteryData>({
    data: batteryData,
    columns: columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as 'forklifts' | 'battery')}
      className='flex w-full flex-col justify-start gap-6'
    >
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <Label htmlFor='view-selector' className='sr-only'>
          View
        </Label>
        <Select value={tab} onValueChange={(v) => setTab(v as 'forklifts' | 'battery')}>
          <SelectTrigger
            className='@4xl/main:hidden flex w-fit'
            id='view-selector'
          >
            <SelectValue placeholder='Select a view' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='forklifts'>Forklifts</SelectItem>
            <SelectItem value='battery'>Battery</SelectItem>
          </SelectContent>
        </Select>
        {showTabsList && (
          <TabsList className='@4xl/main:flex hidden'>
            <TabsTrigger value='forklifts'>Forklifts</TabsTrigger>
            <TabsTrigger value='battery'>Battery</TabsTrigger>
          </TabsList>
        )}
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <ColumnsIcon />
                <span className='hidden lg:inline'>Customize Columns</span>
                <span className='lg:hidden'>Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              {(tab === 'forklifts' ? forkliftTable : batteryTable)
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent
        value='forklifts'
        className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'
      >
        <div className='overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader className='sticky top-0 z-10 bg-muted'>
              {forkliftTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className='**:data-[slot=table-cell]:first:w-8'>
              {forkliftTable.getRowModel().rows?.length ? (
                forkliftTable.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={forkliftColumns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-between px-4'>
          <div className='hidden flex-1 text-sm text-muted-foreground lg:flex'>
            {forkliftTable.getFilteredSelectedRowModel().rows.length} of{' '}
            {forkliftTable.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className='flex w-full items-center gap-8 lg:w-fit'>
            <div className='hidden items-center gap-2 lg:flex'>
              <Label htmlFor='rows-per-page' className='text-sm font-medium'>
                Rows per page
              </Label>
              <Select
                value={`${forkliftTable.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  forkliftTable.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className='w-20' id='rows-per-page'>
                  <SelectValue
                    placeholder={forkliftTable.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side='top'>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex w-fit items-center justify-center text-sm font-medium'>
              Page {forkliftTable.getState().pagination.pageIndex + 1} of{' '}
              {forkliftTable.getPageCount()}
            </div>
            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => forkliftTable.setPageIndex(0)}
                disabled={!forkliftTable.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => forkliftTable.previousPage()}
                disabled={!forkliftTable.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => forkliftTable.nextPage()}
                disabled={!forkliftTable.getCanNextPage()}
              >
                <span className='sr-only'>Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant='outline'
                className='hidden size-8 lg:flex'
                size='icon'
                onClick={() => forkliftTable.setPageIndex(forkliftTable.getPageCount() - 1)}
                disabled={!forkliftTable.getCanNextPage()}
              >
                <span className='sr-only'>Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value='battery'
        className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'
      >
        <div className='overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader className='sticky top-0 z-10 bg-muted'>
              {batteryTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className='**:data-[slot=table-cell]:first:w-8'>
              {batteryTable.getRowModel().rows?.length ? (
                batteryTable.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-between px-4'>
          <div className='hidden flex-1 text-sm text-muted-foreground lg:flex'>
            {batteryTable.getFilteredSelectedRowModel().rows.length} of{' '}
            {batteryTable.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className='flex w-full items-center gap-8 lg:w-fit'>
            <div className='hidden items-center gap-2 lg:flex'>
              <Label htmlFor='rows-per-page' className='text-sm font-medium'>
                Rows per page
              </Label>
              <Select
                value={`${batteryTable.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  batteryTable.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className='w-20' id='rows-per-page'>
                  <SelectValue
                    placeholder={batteryTable.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side='top'>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex w-fit items-center justify-center text-sm font-medium'>
              Page {batteryTable.getState().pagination.pageIndex + 1} of{' '}
              {batteryTable.getPageCount()}
            </div>
            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => batteryTable.setPageIndex(0)}
                disabled={!batteryTable.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => batteryTable.previousPage()}
                disabled={!batteryTable.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => batteryTable.nextPage()}
                disabled={!batteryTable.getCanNextPage()}
              >
                <span className='sr-only'>Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant='outline'
                className='hidden size-8 lg:flex'
                size='icon'
                onClick={() => batteryTable.setPageIndex(batteryTable.getPageCount() - 1)}
                disabled={!batteryTable.getCanNextPage()}
              >
                <span className='sr-only'>Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value='past-performance'
        className='flex flex-col px-4 lg:px-6'
      >
        <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
      </TabsContent>
      <TabsContent value='key-personnel' className='flex flex-col px-4 lg:px-6'>
        <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
      </TabsContent>
      <TabsContent
        value='focus-documents'
        className='flex flex-col px-4 lg:px-6'
      >
        <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
      </TabsContent>
    </Tabs>
  );
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: z.infer<typeof batterySchema> }) {
  const isMobile = useIsMobile();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='link' className='w-fit px-0 text-left text-foreground'>
          {item.info}
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='flex flex-col'>
        <SheetHeader className='gap-1'>
          <SheetTitle>{item.info}</SheetTitle>
          <SheetDescription>Battery details and statistics</SheetDescription>
        </SheetHeader>
        <div className='flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm'>
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='month'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator='dot' />}
                  />
                  <Area
                    dataKey='mobile'
                    type='natural'
                    fill='var(--color-mobile)'
                    fillOpacity={0.6}
                    stroke='var(--color-mobile)'
                    stackId='a'
                  />
                  <Area
                    dataKey='desktop'
                    type='natural'
                    fill='var(--color-desktop)'
                    fillOpacity={0.4}
                    stroke='var(--color-desktop)'
                    stackId='a'
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className='grid gap-2'>
                <div className='flex gap-2 font-medium leading-none'>
                  Trending up by 5.2% this month{" "}
                  <TrendingUpIcon className='size-4' />
                </div>
                <div className='text-muted-foreground'>
                  Showing total work hour and battery info for the last 6
                  months.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-3'>
              <Label htmlFor='info'>Info</Label>
              <Input id='info' defaultValue={item.info} />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='battery_type'>Battery Type</Label>
                <Input id='battery_type' defaultValue={item.battery_type} />
              </div>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='device_status'>Device Status</Label>
                <Select defaultValue={item.device_status}>
                  <SelectTrigger id='device_status' className='w-full'>
                    <SelectValue placeholder='Select a status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Active'>Active</SelectItem>
                    <SelectItem value='Inactive'>Inactive</SelectItem>
                    <SelectItem value='Faulty'>Faulty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='total_work_hour'>Total Work Hour</Label>
                <Input
                  id='total_work_hour'
                  defaultValue={item.total_work_hour}
                />
              </div>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='last_on'>Last On</Label>
                <Input
                  id='last_on'
                  defaultValue={
                    item.last_on ? new Date(item.last_on).toLocaleString() : ""
                  }
                />
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <Label htmlFor='release_date'>Release Date</Label>
              <Input
                id='release_date'
                defaultValue={
                  item.release_date
                    ? new Date(item.release_date).toLocaleDateString()
                    : ""
                }
              />
            </div>
          </form>
        </div>
        <SheetFooter className='mt-auto flex gap-2 sm:flex-col sm:space-x-0'>
          <Button className='w-full'>Submit</Button>
          <SheetClose asChild>
            <Button variant='outline' className='w-full'>
              Done
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
