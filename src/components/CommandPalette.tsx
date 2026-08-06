import { useQuery } from "@apollo/client";
import { FolderKanban, Home, ListTodo, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { PROJECTS_QUERY } from "@/routes/projects/projects-query";

const NAV_ITEMS = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "Projects", icon: FolderKanban, path: "/projects" },
  { label: "My Tasks", icon: ListTodo, path: "/my-tasks" },
  { label: "Search", icon: Search, path: "/search" },
  { label: "Trash", icon: Trash2, path: "/trash" },
] as const;

export function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data } = useQuery(PROJECTS_QUERY, {
    variables: { limit: 20 },
    skip: !open,
  });

  const projects = data?.getProjects?.nodes ?? [];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command palette" description="Search commands and projects">
      <CommandInput placeholder="Search commands and projects…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => (
            <CommandItem key={item.path} value={item.label} onSelect={() => runCommand(() => navigate(item.path))}>
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {projects.length > 0 ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {projects.map((project: { id: string; name: string }) => (
                <CommandItem
                  key={project.id}
                  value={`${project.name} ${project.id}`}
                  onSelect={() => runCommand(() => navigate(`/projects/${project.id}`))}
                >
                  <FolderKanban className="size-4" />
                  <span>{project.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}

        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            value="Create task"
            onSelect={() =>
              runCommand(() => {
                navigate("/projects");
                toast.message("Select a project to create a task");
              })
            }
          >
            <Plus className="size-4" />
            <span>Create task…</span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
