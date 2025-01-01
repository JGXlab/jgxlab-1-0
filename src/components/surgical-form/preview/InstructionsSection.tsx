interface InstructionsSectionProps {
  instructions?: string;
}

export const InstructionsSection = ({ instructions }: InstructionsSectionProps) => (
  <div>
    <h3 className="text-lg font-medium mb-4">Additional Information</h3>
    <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
      {instructions && (
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">Specific Instructions</p>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {instructions}
          </p>
        </div>
      )}
    </div>
  </div>
);