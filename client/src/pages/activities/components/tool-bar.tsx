import Between from "@components/commons/between";
import TextInput from "@components/inputs/text-input";
import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { Ellipsis, Plus, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import SegmentSelect from "@components/selects/segment-select";
import StatusSelect from "@components/selects/status-select";
import DateInput from "@components/inputs/date-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface Props {
  form: any;
}

function Toolbar({ form }: Props) {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState<boolean>(false);

  const toggleFilter = () => {
    setOpenFilters((prev) => !prev);
  };

  return (
    <div>
      {/* Mobile Filters and Actions */}
      <Between className="items-start flex sm:hidden">
        <Button
          onClick={toggleFilter}
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          {openFilters ? (
            <X className="h-4 w-4" />
          ) : (
            <SlidersHorizontal className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="space-y-1">
            <DropdownMenuItem onClick={() => navigate("/activities/create")}>
              <Plus className="h-4 w-4 mr-1" />
              Create visit plan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Between>

      {/* Mobile Filter Form */}
      <div>
        <Form {...form}>
          <form
            className={clsx(
              "flex sm:hidden flex-col sm:flex-row gap-4 overflow-hidden transition-all duration-300",
              openFilters ? "mt-4 max-h-[100vh] min-h-0" : "h-0",
            )}
          >
            <TextInput placeholder="Search entity" name="search" form={form} />

            <SegmentSelect
              placeholder="Select segment"
              name="segment"
              className="min-w-[200px]"
              form={form}
            />

            <StatusSelect
              placeholder="Select status"
              name="status"
              className="min-w-[200px]"
              form={form}
            />

            <DateInput
              placeholder="Select start date"
              name="from"
              form={form}
            />

            <DateInput placeholder="Select end date" name="to" form={form} />
          </form>
        </Form>
      </div>

      {/* Desktop Filters and Actions */}
      <Between className="hidden sm:flex">
        <Form {...form}>
          <form
            className={clsx(
              "flex flex-col sm:flex-row gap-4 overflow-hidden transition-all duration-300",
            )}
          >
            <TextInput placeholder="Search entity" name="search" form={form} />

            <SegmentSelect
              placeholder="Select segment"
              name="segment"
              className="min-w-[200px]"
              form={form}
            />

            <StatusSelect
              placeholder="Select status"
              name="status"
              className="min-w-[200px]"
              form={form}
            />

            <DateInput
              placeholder="Select start date"
              name="from"
              form={form}
            />

            <DateInput placeholder="Select end date" name="to" form={form} />
          </form>

          <div className="flex gap-4">
            <Button onClick={() => navigate("/activities/create")}>
              <Plus className="h-4 w-4 mr-1" />
              Create visit plan
            </Button>
          </div>
        </Form>
      </Between>
    </div>
  );
}

export default Toolbar;
