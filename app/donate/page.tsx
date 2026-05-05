import { DonateForm } from "@/components/donate/donate-form";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Landmark } from "lucide-react";

export const donates = [
  {
    id: "plus",
    name: "Well-plus",
    description: "New features",
    cost: "150.00",
  },
  {
    id: "deluxe",
    name: "Well-deluxe",
    description: "New deluxe features",
    cost: "500.00",
  },
] satisfies { id: string; name: string; description: string; cost: string }[];

export default function Donate() {
  return (
    <div>
      <ItemGroup>
        {donates.map((e) => (
          <Item key={e.id}>
            <ItemMedia>
              <div className="p-4 rounded-2xl">
                <Landmark />
              </div>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{e.name}</ItemTitle>
              <ItemDescription>{e.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
             <DonateForm id={e.id}/>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
