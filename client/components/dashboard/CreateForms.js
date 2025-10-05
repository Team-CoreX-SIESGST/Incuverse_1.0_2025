"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Save,
  Edit,
  Eye,
  Trash2,
  Type,
  Text,
  Radio,
  CheckSquare,
  Calendar,
} from "lucide-react";

export default function CreateForms() {
  const [forms, setForms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    fields: [],
  });
  const [currentField, setCurrentField] = useState({
    type: "text",
    question: "",
    options: [],
  });

  useEffect(() => {
    // Mock data
    const mockForms = [
      {
        id: 1,
        title: "Patient Health Assessment",
        description: "Basic health assessment form for new patients",
        fields: 12,
        responses: 45,
        createdAt: "2024-01-10",
      },
      {
        id: 2,
        title: "Maternal Care Follow-up",
        description: "Follow-up form for pregnant women",
        fields: 8,
        responses: 23,
        createdAt: "2024-01-12",
      },
    ];
    setForms(mockForms);
  }, []);

  const addField = () => {
    if (currentField.question.trim()) {
      setNewForm({
        ...newForm,
        fields: [...newForm.fields, { ...currentField, id: Date.now() }],
      });
      setCurrentField({
        type: "text",
        question: "",
        options: [],
      });
    }
  };

  const removeField = (fieldId) => {
    setNewForm({
      ...newForm,
      fields: newForm.fields.filter((field) => field.id !== fieldId),
    });
  };

  const createForm = () => {
    if (newForm.title.trim() && newForm.fields.length > 0) {
      const form = {
        id: Date.now(),
        ...newForm,
        fields: newForm.fields.length,
        responses: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setForms([...forms, form]);
      setShowCreateModal(false);
      setNewForm({ title: "", description: "", fields: [] });
    }
  };

  const fieldTypes = [
    { value: "text", label: "Text Input", icon: Type },
    { value: "textarea", label: "Text Area", icon: Text },
    { value: "radio", label: "Multiple Choice", icon: Radio },
    { value: "checkbox", label: "Checkboxes", icon: CheckSquare },
    { value: "date", label: "Date", icon: Calendar },
  ];

  const FieldIcon = ({ type }) => {
    const fieldType = fieldTypes.find((t) => t.value === type);
    const IconComponent = fieldType?.icon || Type;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Create Forms
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Design custom forms for data collection
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Form
        </button>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              {form.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              {form.description}
            </p>
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
              <span>{form.fields} fields</span>
              <span>{form.responses} responses</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Created {form.createdAt}
              </span>
              <div className="flex gap-2">
                <button className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Form Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Create New Form
              </h3>
            </div>

            <div className="p-6">
              {/* Form Details */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Form Title
                </label>
                <input
                  type="text"
                  value={newForm.title}
                  onChange={(e) =>
                    setNewForm({ ...newForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Enter form title"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newForm.description}
                  onChange={(e) =>
                    setNewForm({ ...newForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Enter form description"
                />
              </div>

              {/* Add Field Section */}
              <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-white mb-4">
                  Add Field
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Field Type
                    </label>
                    <select
                      value={currentField.type}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          type: e.target.value,
                          options: [],
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      {fieldTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      value={currentField.question}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          question: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="Enter question"
                    />
                  </div>
                </div>

                {(currentField.type === "radio" ||
                  currentField.type === "checkbox") && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Options (one per line)
                    </label>
                    <textarea
                      value={currentField.options.join("\n")}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          options: e.target.value
                            .split("\n")
                            .filter((opt) => opt.trim()),
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="Enter options, one per line"
                    />
                  </div>
                )}

                <button
                  onClick={addField}
                  className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Add Field
                </button>
              </div>

              {/* Preview Fields */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 dark:text-white mb-4">
                  Form Fields ({newForm.fields.length})
                </h4>
                <div className="space-y-3">
                  {newForm.fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex justify-between items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FieldIcon type={field.type} />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {field.question}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {
                              fieldTypes.find((t) => t.value === field.type)
                                ?.label
                            }
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeField(field.id)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createForm}
                disabled={!newForm.title.trim() || newForm.fields.length === 0}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Create Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
