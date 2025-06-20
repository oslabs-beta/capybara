// ----------------------------------------------------------
// >> CLUSTER SELECTOR << //
// ----------------------------------------------------------
// * Added to navigation bar for better UX

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCluster } from '@/contexts/ClusterContext';
import { ServerIcon } from 'lucide-react';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';

// * Status Badge Component for Connected Cluster
const ConnectedStatusBadge = ({
  clusterName,
  location,
}: {
  clusterName: string;
  location?: string;
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400"
    >
      <motion.div
        className="h-2 w-2 rounded-full bg-green-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-sm">{clusterName}</span>
      {location && (
        <span className="text-sm text-green-600 dark:text-green-300">
          ({location})
        </span>
      )}
    </motion.div>
  );
};

const ClusterSelector: React.FC = () => {
  const { clusters, selectedCluster, setSelectedCluster, loading } =
    useCluster();
  const [selectedKey, setSelectedKey] = useState<string | number | null>(null);

  // Convert clusters to the format expected by HeroUI Autocomplete
  const clusterItems = clusters.map((cluster) => ({
    key: `${cluster.name}-${cluster.location || 'default'}`,
    label: cluster.name,
    description: cluster.location || 'No location specified',
    cluster: cluster, // Keep reference to original cluster object
  }));

  const onSelectionChange = (key: string | number | null) => {
    setSelectedKey(key);
    if (key) {
      const selectedItem = clusterItems.find((item) => item.key === key);
      if (selectedItem) {
        setSelectedCluster(selectedItem.cluster);
      }
    }
  };

  const onInputChange = () => {};

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-4">
        <ServerIcon className="text-primary h-5 w-5" />
        <span className="text-muted-foreground">fetching clusters...</span>
      </div>
    );
  }

  if (clusters.length === 0) {
    return (
      <div className="flex items-center gap-3 py-4">
        <ServerIcon className="text-primary h-5 w-5" />
        <span className="text-muted-foreground">No clusters available</span>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-4 flex items-center">
        <h2 className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
          Connect to Cluster
        </h2>
      </div>

      {/* CONNECTED TO - Updated with Status Badge */}
      {selectedCluster && (
        <div className="mb-1 flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Connection:</span>
          <ConnectedStatusBadge
            clusterName={selectedCluster.name}
            location={selectedCluster.location}
          />
        </div>
      )}

      <Autocomplete
        allowsCustomValue={false}
        isClearable={false}
        className="max-w-full"
        defaultItems={clusterItems}
        placeholder="search clusters..."
        variant="faded"
        labelPlacement="outside"
        onInputChange={onInputChange}
        onSelectionChange={onSelectionChange}
        selectedKey={selectedKey}
        classNames={{
          base: 'w-full',
          listboxWrapper: 'max-h-60 overflow-auto',
          listbox: 'bg-popover border-0',
          popoverContent:
            'bg-popover border border-input rounded-md shadow-md p-0 mt-1',
          endContentWrapper: 'text-foreground',
          clearButton: 'text-foreground hover:text-foreground',
          selectorButton: 'text-foreground hover:text-foreground',
        }}
        popoverProps={{
          classNames: {
            base: 'bg-popover',
            content: 'bg-popover border border-input rounded-md shadow-md p-0',
          },
        }}
        listboxProps={{
          classNames: {
            base: 'bg-popover',
            list: 'bg-popover',
            emptyContent: 'text-muted-foreground p-3',
          },
        }}
        inputProps={{
          classNames: {
            base: 'bg-transparent',
            input:
              'text-base sm:text-md text-foreground placeholder:text-muted-foreground focus:outline-none',
            inputWrapper: [
              'bg-transparent',
              'border',
              'border-input',
              'rounded-md',
              'shadow-xs',
              'focus-within:border-ring',
              'focus-within:ring-2',
              'focus-within:ring-ring/50',
              'transition-colors',
              'h-[34px] sm:h-[38px]',
              'py-2',
              'px-3',
            ].join(' '),
            label: 'hidden',
          },
        }}
      >
        {(item) => (
          <AutocompleteItem
            key={item.key}
            textValue={item.label}
            classNames={{
              base: [
                'rounded-none',
                'py-2',
                'px-3',
                'data-[hover=true]:bg-accent',
                'data-[hover=true]:text-accent-foreground',
                'data-[selectable=true]:focus:bg-accent',
                'data-[selectable=true]:focus:text-accent-foreground',
                'data-[focus=true]:bg-accent',
                'data-[focus=true]:text-accent-foreground',
                'transition-colors',
                'focus:outline-none',
              ].join(' '),
              selectedIcon: 'text-primary h-4 w-4',
              title: 'text-base sm:text-md font-medium',
              description: 'hidden',
            }}
          >
            <div className="flex w-full flex-col items-start">
              <span className="sm:text-md text-base font-medium">
                {item.label}
              </span>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
};

export default ClusterSelector;
