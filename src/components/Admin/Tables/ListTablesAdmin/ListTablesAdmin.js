import React, { useState, useEffect } from "react";
import { Label, Button, Icon, Checkbox } from "semantic-ui-react";
import { map, size } from "lodash";
import { TableAdmin } from "../";
import "./ListTablesAdmin.scss";

export function ListTablesAdmin(props) {
  const { tables } = props;
  const [reload, setReload] = useState(false);
  const [autoReload, setAutoReload] = useState(false);

  const onReload = () => setReload((prev) => !prev);
  const onCheckAutoReload = (check) => {
    check ? setAutoReload(check) : window.location.reload();
  };

  useEffect(() => {
    if (autoReload) {
      const autoReloadAction = () => {
        onReload();
        setTimeout(() => {
          autoReloadAction();
        }, 5000);
      };
      autoReloadAction();
    }
  }, [autoReload]);

  return (
    <div className="list-tables-admin">
      <Button
        primary
        icon
        className="list-tables-admin__reload"
        onClick={onReload}
      >
        <Icon name="refresh" />
      </Button>

      <div className="list-tables-admin__reload-toggle">
        <span>Reload automatico</span>
        <Checkbox
          toggle
          checked={autoReload}
          onChange={(_, data) => onCheckAutoReload(data.checked)}
        />
      </div>

      {map(tables, (table) => (
        <TableAdmin key={table.number} table={table} reload={reload} />
      ))}
    </div>
  );
}
