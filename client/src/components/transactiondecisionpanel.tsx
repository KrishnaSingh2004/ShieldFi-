import { useState } from "react";
              <p className="font-semibold text-foreground" data-testid="transaction-amount">
                ${currentTransaction.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recipient</p>
              <p className="font-semibold text-foreground" data-testid="transaction-recipient">
                {currentTransaction.recipient}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-semibold text-foreground">
                {currentTransaction.location}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Device</p>
              <p className="font-semibold text-foreground">
                {currentTransaction.deviceInfo}
              </p>
            </div>
          </div>

          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              <strong>AI Risk Assessment:</strong>
              <p className="mt-1" data-testid="risk-explanation">
                {currentTransaction.explanation}
              </p>
            </AlertDescription>
          </Alert>

          <div className="flex space-x-3">
            <Button 
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-approve"
            >
              <Check className="mr-2 h-4 w-4" />
              {approveMutation.isPending ? "Approving..." : "Approve"}
            </Button>
            <Button 
              onClick={() => blockMutation.mutate()}
              disabled={blockMutation.isPending}
              variant="destructive"
              data-testid="button-block"
            >
              <Ban className="mr-2 h-4 w-4" />
              {blockMutation.isPending ? "Blocking..." : "Block"}
            </Button>
            <Button variant="outline" data-testid="button-investigate">
              <Search className="mr-2 h-4 w-4" />
              Investigate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
