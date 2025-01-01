interface InstructionsSectionProps {
  instructions?: string;
}

export const InstructionsSection = ({ instructions }: InstructionsSectionProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900">Specific Instructions</h3>
    <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500">Specific Instructions</p>
        {instructions ? (
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{instructions}</p>
        ) : (
          <p className="text-sm text-gray-500 italic">No specific instructions provided</p>
        )}
      </div>
    </div>
  </div>
);