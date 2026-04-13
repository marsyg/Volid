import { ShieldAlertIcon } from 'lucide-react';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export const UnautheticatedView = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="w-full max-w-full bg-muted">
        <Item variant="outline">
          <ItemMedia variant="icon">
            <ShieldAlertIcon></ShieldAlertIcon>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Unauthorized Acess</ItemTitle>
            <ItemDescription>
              You are not authorized to access this content .
            </ItemDescription>
            <ItemActions>
              <SignInButton>
                <Button variant="outline"> Sign in</Button>
              </SignInButton>
            </ItemActions>
          </ItemContent>
        </Item>
      </div>
    </div>
  );
};
