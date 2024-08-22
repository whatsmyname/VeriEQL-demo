'use client';


import React, {useState} from "react";

import Header from "@/app/components/header";



export default function Home() {
    function handleVerify() {
        try {
            let data = {
                "query1": query1,
                "query2": query2,
                "bound": parseInt(bound.toString()),
                "schema": JSON.parse(schema.toString()),
                "constraints": constraints.toString() === '' ? [] : JSON.parse(constraints.toString()),
                "dialect": selectedDialect,
            }
            if (!(constraints instanceof Object)) {
                data = {
                    "query1": query1,
                    "query2": query2,
                    "bound": parseInt(bound.toString()),
                    "schema": JSON.parse(schema.toString()),
                    "constraints": constraints.toString() === '' ? [] : JSON.parse(constraints.replaceAll('.', '__').toString()),
                    "dialect": selectedDialect,
                }
            }

            // console.log(data);

            fetch('http://127.0.0.1:8000/verify', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }).then((response) => {
                // console.log(response)
                return response.json();
            }).then((data) => {
                const status = document.getElementById('decision');
                const counterexample = document.getElementById('counterexample');
                let text = '';

                switch (data.decision) {
                    case 'EQU':
                        text = '<span class="text-green-600">Equivalent</span>';
                        // @ts-ignore
                        counterexample.innerHTML = '';
                        break
                    case 'NEQ':
                        text = '<span class="text-red-600">Non-equivalent</span>';
                        break;
                    case 'TMO':
                        text = '<span class="accent-gray-600">Timeout</span>';
                        // @ts-ignore
                        counterexample.innerHTML = '';
                        break;
                    default:
                        text = '<span class="accent-gray-600">Unsupported</span>';
                        // @ts-ignore
                        counterexample.innerHTML = '';
                }

                // @ts-ignore
                status.innerHTML = text;

                if (data.decision === 'NEQ') {
                    let counterexample_text = `<div class="flex space-x-2">
                    <div class="font-extrabold text-xl">
                        Counterexample
                    </div>
                </div>`;

                    for (const [table_name, table_rows] of Object.entries(data.counterexample)) {
                        // @ts-ignore
                        counterexample_text += generateCounterexampleTable(table_name, table_rows);
                    }

                    counterexample_text += `
                    <div class="collapse bg-base-200 mt-4">
                      <input type="checkbox" />
                      <div class="collapse-title font-medium">Show Counterexample SQL Code</div>
                      <div class="collapse-content">
                      <button class="btn btn-outline btn-sm mb-2" onclick="navigator.clipboard.writeText(\`${data.counterexample_sql}\`);alert('Copied to the clipboard');">
                        Copy Code
                      </button>
                      <pre class="whitespace-pre-wrap text-xs">${data.counterexample_sql}</pre>
                      </div>
                    </div>
                    `;

                    // @ts-ignore
                    counterexample.innerHTML = counterexample_text;
                }

                // <button class="btn p-2" onclick="navigator.clipboard.writeText(\`${data.pysmt_formula}\`);alert('Copied to the clipboard');">
                //   Copy Code
                // </button>

                if (data.decision === 'NEQ' || data.decision === 'EQU') {
                    // @ts-ignore
                    counterexample.innerHTML += `
                    <div class="collapse bg-base-200 mt-4">
                      <input type="checkbox" />
                      <div class="collapse-title font-medium">Show SMT Formula</div>
                      <div class="collapse-content">
                      <pre class="whitespace-pre-wrap text-xs">${data.pysmt_formula}</pre>
                      </div>
                    </div>
                    `;
                }
            });

        } catch (error) {
            const status = document.getElementById('decision');
            const counterexample = document.getElementById('counterexample');
            // @ts-ignore
            status.innerHTML = '';
            // @ts-ignore
            counterexample.innerHTML = '';

            alert('Schema format incorrect');
        }
    }

    function generateCounterexampleTable(table_name: string, table_rows: ({ [s: string]: unknown; } | ArrayLike<unknown>)[]) {
        let table = `<div class="mt-2 text-sm leading-5 font-bold">${table_name}</div>`;

        table += '<div class="flex space-x-2"> <div class="overflow-x-auto"><table class="table"><thead><tr>';

        for (const [attribute] of Object.entries(table_rows[0])) {
            table += `<th class="bg-base-200 lg:py-3">${attribute}</th>`;
        }

        table += '</tr></thead> <tbody>';

        table_rows.forEach((row) => {
            table += `<tr>`;
            for (const [, key] of Object.entries(row)) {
                table += `<td>${key}</td>`;
            }
            table += `</tr>`;
        });

        table += `</tbody></table></div></div>`;

        return table;
    }


    const [query1, setQuery1] = useState("");
    const [query2, setQuery2] = useState("");
    const [bound, setBound] = useState<string | number>(2);
    const [schema, setSchema] = useState<string | object>("");
    const [constraints, setConstraints] = useState<string | object>("");
    const [selectedDialect, setSelectedDialect] = useState("Generic");
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (dialect: string) => {
        setSelectedDialect(dialect);
        setIsOpen(false);
    };

    function loadFig1Example() {
        const status = document.getElementById('decision');
        const counterexample = document.getElementById('counterexample');
        // @ts-ignore
        status.innerHTML = '';
        // @ts-ignore
        counterexample.innerHTML = '';

        setQuery1('SELECT ROUND((SUM(ORDER_DATE = CUSTOMER_PREF_DELIVERY_DATE) / COUNT(*)) * 100 , 2) AS IMMEDIATE_PERCENTAGE FROM DELIVERY');
        setQuery2('SELECT ROUND(SUM(IF(ORDER_DATE = CUSTOMER_PREF_DELIVERY_DATE, 1,0 ))/COUNT(DELIVERY_ID) *100,2) AS IMMEDIATE_PERCENTAGE FROM DELIVERY');
        setBound(2);
        setSchema('{\n' +
            '    "DELIVERY": {\n' +
            '        "DELIVERY_ID": "INT",\n' +
            '        "CUSTOMER_ID": "INT",\n' +
            '        "ORDER_DATE": "DATE",\n' +
            '        "CUSTOMER_PREF_DELIVERY_DATE": "DATE"\n' +
            '    }\n' +
            '}');
        setConstraints('[\n' +
            '    {"primary": [{"value": "DELIVERY.DELIVERY_ID"}]}\n' +
            ']');
    }

    function loadCalciteExample() {
        const status = document.getElementById('decision');
        const counterexample = document.getElementById('counterexample');
        // @ts-ignore
        status.innerHTML = '';
        // @ts-ignore
        counterexample.innerHTML = '';

        setQuery1('SELECT DEPTNO, COUNT(*) FILTER (WHERE JOB = \'CLERK\') FROM (SELECT * FROM EMP WHERE DEPTNO = 10 UNION ALL SELECT * FROM EMP WHERE DEPTNO > 20) AS t3 GROUP BY DEPTNO');
        setQuery2('SELECT DEPTNO, COALESCE(SUM(EXPR$1), 0) FROM (SELECT DEPTNO, COUNT(*) FILTER (WHERE JOB = \'CLERK\') AS EXPR$1 FROM EMP WHERE DEPTNO = 10 GROUP BY DEPTNO UNION ALL SELECT DEPTNO, COUNT(*) FILTER (WHERE JOB = \'CLERK\') AS EXPR$1 FROM EMP WHERE DEPTNO > 20 GROUP BY DEPTNO) AS t12 GROUP BY DEPTNO');
        setBound(2);
        setSchema('{"EMP": {"EMPNO": "INT", "DEPTNO": "int", "ENAME": "VARCHAR", "JOB": "VARCHAR", "MGR": "INT",\n' +
            '                          "HIREDATE": "DATE", "SAL": "INT", "COMM": "INT", "SLACKER": "BOOLEAN"},\n' +
            '                  "DEPT": {"DEPTNO": "INT", "NAME": "VARCHAR"},\n' +
            '                  "BONUS": {"ENAME": "VARCHAR", "JOB": "VARCHAR", "SAL": "INT", "COMM": "INT"},\n' +
            '                  "EMPNULLABLES": {"EMPNO": "INT", "DEPTNO": "int", "ENAME": "VARCHAR", "JOB": "VARCHAR", "MGR": "INT",\n' +
            '                                   "HIREDATE": "DATE", "SAL": "INT", "COMM": "INT", "SLACKER": "BOOLEAN"},\n' +
            '                  "EMPNULLABLES_20": {"EMPNO": "INT", "DEPTNO": "int", "ENAME": "VARCHAR", "JOB": "VARCHAR",\n' +
            '                                      "MGR": "INT", "HIREDATE": "DATE", "SAL": "INT", "COMM": "INT",\n' +
            '                                      "SLACKER": "BOOLEAN"},\n' +
            '                  "EMP_B": {"EMPNO": "INT", "DEPTNO": "int", "ENAME": "VARCHAR", "JOB": "VARCHAR", "MGR": "INT",\n' +
            '                            "HIREDATE": "DATE", "SAL": "INT", "COMM": "INT", "SLACKER": "BOOLEAN", "BIRTHDATE": "DATE"}}');
        setConstraints('[{"primary": [{"value": "EMP.EMPNO"}]},\n' +
            '                       {"foreign": [{"value": "EMP.DEPTNO"}, {"value": "DEPT.DEPTNO"}]},\n' +
            '                       {"primary": [{"value": "DEPT.DEPTNO"}]}, {"primary": [{"value": "EMPNULLABLES.EMPNO"}]},\n' +
            '                       {"foreign": [{"value": "EMPNULLABLES.DEPTNO"}, {"value": "DEPT.DEPTNO"}]},\n' +
            '                       {"primary": [{"value": "EMPNULLABLES_20.EMPNO"}]},\n' +
            '                       {"foreign": [{"value": "EMPNULLABLES_20.DEPTNO"}, {"value": "DEPT.DEPTNO"}]},\n' +
            '                       {"primary": [{"value": "EMP_B.EMPNO"}]},\n' +
            '                       {"foreign": [{"value": "EMP_B.DEPTNO"}, {"value": "DEPT.DEPTNO"}]},\n' +
            '                       {"not_null": {"value": "EMP.EMPNO"}}, {"not_null": {"value": "EMP.ENAME"}},\n' +
            '                       {"not_null": {"value": "EMP.JOB"}}, {"not_null": {"value": "EMP.HIREDATE"}},\n' +
            '                       {"not_null": {"value": "EMP.SAL"}}, {"not_null": {"value": "EMP.COMM"}},\n' +
            '                       {"not_null": {"value": "EMP.DEPTNO"}}, {"not_null": {"value": "EMP.SLACKER"}},\n' +
            '                       {"not_null": {"value": "DEPT.DEPTNO"}}, {"not_null": {"value": "DEPT.NAME"}},\n' +
            '                       {"not_null": {"value": "BONUS.ENAME"}}, {"not_null": {"value": "BONUS.JOB"}},\n' +
            '                       {"not_null": {"value": "BONUS.SAL"}}, {"not_null": {"value": "BONUS.COMM"}},\n' +
            '                       {"not_null": {"value": "EMP_B.EMPNO"}}, {"not_null": {"value": "EMP_B.ENAME"}},\n' +
            '                       {"not_null": {"value": "EMP_B.JOB"}}, {"not_null": {"value": "EMP_B.HIREDATE"}},\n' +
            '                       {"not_null": {"value": "EMP_B.SAL"}}, {"not_null": {"value": "EMP_B.COMM"}},\n' +
            '                       {"not_null": {"value": "EMP_B.DEPTNO"}}, {"not_null": {"value": "EMP_B.SLACKER"}},\n' +
            '                       {"not_null": {"value": "EMP_B.BIRTHDATE"}}]');
    }

    function loadLeetCodeExample() {
        const status = document.getElementById('decision');
        const counterexample = document.getElementById('counterexample');
        // @ts-ignore
        status.innerHTML = '';
        // @ts-ignore
        counterexample.innerHTML = '';

        setQuery1('WITH TEMP AS (SELECT DISTINCT A.CUSTOMER_ID, B.CUSTOMER_ID, B.CUSTOMER_NAME, SUM(CASE WHEN A.PRODUCT_NAME IN (\'A\', \'B\') THEN 1 ELSE 0 END) AS AB, SUM(CASE WHEN A.PRODUCT_NAME = \'C\' THEN 1 ELSE 0 END) AS C, CUSTOMER_NAME FROM ORDERS A JOIN CUSTOMERS B ON A.CUSTOMER_ID = B.CUSTOMER_ID GROUP BY A.CUSTOMER_ID) SELECT CUSTOMER_ID, CUSTOMER_NAME FROM TEMP WHERE AB >= 2 AND C = 0');
        setQuery2('SELECT CUSTOMER_ID, CUSTOMER_NAME FROM CUSTOMERS WHERE CUSTOMER_ID IN (SELECT DISTINCT CUSTOMER_ID FROM ORDERS WHERE PRODUCT_NAME = \'A\') AND CUSTOMER_ID IN (SELECT DISTINCT CUSTOMER_ID FROM ORDERS WHERE PRODUCT_NAME = \'B\') AND CUSTOMER_ID NOT IN (SELECT DISTINCT CUSTOMER_ID FROM ORDERS WHERE PRODUCT_NAME = \'C\') ORDER BY CUSTOMER_ID');
        setBound(2);
        setSchema('{\n' +
            '  "CUSTOMERS": {"CUSTOMER_ID": "INT", "CUSTOMER_NAME": "VARCHAR"},\n' +
            '  "ORDERS": {"ORDER_ID": "INT", "CUSTOMER_ID": "int", "PRODUCT_NAME": "VARCHAR"}\n' +
            '}');
        setConstraints('[\n' +
            '  {"primary": [{"value": "CUSTOMERS.CUSTOMER_ID"}]},\n' +
            '  {"primary": [{"value": "ORDERS.ORDER_ID"}]},\n' +
            '  {"foreign": [{"value": "ORDERS.CUSTOMER_ID"}, {"value": "CUSTOMERS.CUSTOMER_ID"}]}\n' +
            ']');
    }

    function loadCountBug() {
        const status = document.getElementById('decision');
        const counterexample = document.getElementById('counterexample');
        // @ts-ignore
        status.innerHTML = '';
        // @ts-ignore
        counterexample.innerHTML = '';

        setQuery1('SELECT PNUM FROM PARTS WHERE (PNUM, QOH) IN (SELECT P.PNUM, IF(ISNULL(CT), 0, CT) AS QOH FROM (SELECT PNUM FROM SUPPLY GROUP BY PNUM) P LEFT JOIN (SELECT PNUM, COUNT(SHIPDATE) AS CT FROM SUPPLY WHERE SHIPDATE < (DATE \'1980-01-01\') GROUP BY PNUM) Q ON P.PNUM=Q.PNUM);');
        setQuery2('WITH TEMP(SUPPNUM, CT) AS (SELECT PNUM, COUNT(SHIPDATE) FROM SUPPLY WHERE SHIPDATE < (DATE \'1980-01-01\') GROUP BY PNUM) SELECT PNUM FROM PARTS, TEMP WHERE PARTS.QOH = TEMP.CT AND PARTS.PNUM = TEMP.SUPPNUM;');
        setBound(1);
        setSchema('{\n' +
            '  "PARTS":{"PNUM":"INT","QOH":"INT"},\n' +
            '  "SUPPLY":{"PNUM":"INT","QOH":"INT","SHIPDATE":"DATE"}\n' +
            '}');
        setConstraints('');
    }

    function loadMySQLBug() {
        const status = document.getElementById('decision');
        const counterexample = document.getElementById('counterexample');
        // @ts-ignore
        status.innerHTML = '';
        // @ts-ignore
        counterexample.innerHTML = '';

        setQuery1('SELECT DISTINCT PAGE_ID AS RECOMMENDED_PAGE FROM (SELECT CASE WHEN USER1_ID=1 THEN USER2_ID WHEN USER2_ID=1 THEN USER1_ID ELSE NULL END AS USER_ID FROM FRIENDSHIP) AS TB1 JOIN LIKES AS TB2 ON TB1.USER_ID=TB2.USER_ID WHERE PAGE_ID NOT IN (SELECT PAGE_ID FROM LIKES WHERE USER_ID=1)');
        setQuery2('SELECT DISTINCT PAGE_ID AS RECOMMENDED_PAGE FROM ( SELECT B.USER_ID, B.PAGE_ID FROM FRIENDSHIP A LEFT JOIN LIKES B ON (A.USER2_ID=B.USER_ID OR A.USER1_ID=B.USER_ID) AND (A.USER1_ID=1 OR A.USER2_ID=1) WHERE B.PAGE_ID NOT IN ( SELECT DISTINCT(PAGE_ID) FROM LIKES WHERE USER_ID=1) ) T');
        setBound(1);
        setSchema('{\n' +
            '  "FRIENDSHIP":{"USER1_ID":"INT","USER2_ID":"INT"},\n' +
            '  "LIKES":{"USER_ID":"INT","PAGE_ID":"INT"}\n' +
            '}');
        setConstraints('[\n' +
            '  {"primary":[{"value":"FRIENDSHIP.USER1_ID"},{"value":"FRIENDSHIP.USER2_ID"}]},\n' +
            '  {"primary":[{"value":"LIKES.USER_ID"},{"value":"LIKES.PAGE_ID"}]},\n' +
            '  {"neq":[{"value":"FRIENDSHIP.USER1_ID"},{"value":"FRIENDSHIP.USER2_ID"}]}\n' +
            ']');
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-14">

            <div className="mb-32 text-center lg:max-w-7xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">

                <Header></Header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/*Left Panel*/}
                    <div className="grid grid-rows-1 gap-4">
                        {/* Left Panel - 1. Queries*/}
                        <div className="space-y-2 rounded-md border-2 border-dashed border-gray-800 p-2">
                            <div className="font-extrabold text-xl">Queries</div>

                            <label htmlFor="query-1" className="block mb-2 text-sm font-medium text-gray-900">Query
                                1</label>
                            <textarea id="query-1" rows={5}
                                      className="textarea textarea-secondary resize-y w-full textarea-bordered"
                                      value={query1}
                                      onChange={e => setQuery1(e.target.value)}>
                            </textarea>

                            <label htmlFor="query-2" className="block mb-2 text-sm font-medium text-gray-900">Query
                                2</label>
                            <textarea id="query-2" rows={5}
                                      value={query2}
                                      onChange={e => setQuery2(e.target.value)}
                                      className="textarea textarea-secondary resize-y w-full textarea-bordered"></textarea>

                            Bound = <input id="bound"
                                           type="number"
                                           placeholder="2"
                                           value={bound}
                                           onChange={e => setBound(e.target.value)}
                                           className="input input-bordered input-s w-16"/>

                            {/* Verify Button*/}
                            <div className="text-center">
                                <button className="btn btn-accent" onClick={() => handleVerify()}>
                                    Verify
                                </button>

                                <div className="dropdown p-2">
                                    <div tabIndex={0} role="button" className="btn" onClick={() => setIsOpen(!isOpen)}>Dialect: {selectedDialect}</div>
                                    {isOpen && (
                                        <ul
                                            tabIndex={0}
                                            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                                        >
                                            <li><a onClick={() => handleSelect("Generic")}>Generic</a></li>
                                            <li><a onClick={() => handleSelect("MySQL")}>MySQL</a></li>
                                            <li><a onClick={() => handleSelect("PostgreSQL")}>PostgreSQL</a></li>
                                            <li><a onClick={() => handleSelect("MariaDB")}>MariaDB</a></li>
                                            <li><a onClick={() => handleSelect("Oracle")}>Oracle</a></li>
                                        </ul>
                                    )}
                                </div>

                            </div>
                        </div>


                        {/* Left Panel - 2. Schema, IC*/}


                    </div>


                    {/*Right Panel*/}
                    <div className="grid grid-rows-1 gap-4">
                        <div className="space-y-2 rounded-md border-2 border-dashed border-gray-800 p-2">

                            <div className="font-extrabold text-xl">Schema</div>

                            <div className="font-bold">Tables Definition</div>
                            <textarea id="schema" rows={5}
                                      value={schema.toString()}
                                      onChange={e => setSchema(e.target.value)}
                                      className="textarea textarea-secondary resize-y w-full textarea-bordered"></textarea>

                            {/*<div className="join">*/}
                            {/*    <ul className="menu bg-base-200 w-56">*/}
                            {/*        <li><a>Emp</a></li>*/}
                            {/*        <li><a className="active">Dept</a></li>*/}
                            {/*        <li><a>Bonus</a></li>*/}
                            {/*        <li><a>+ Add New Table</a></li>*/}
                            {/*    </ul>*/}

                            {/*    <div className="overflow-x-auto">*/}
                            {/*        <table className="table">*/}
                            {/*            /!* head *!/*/}
                            {/*            <thead>*/}
                            {/*            <tr>*/}
                            {/*                <th>Attribute Name</th>*/}
                            {/*                <th>Type</th>*/}
                            {/*            </tr>*/}
                            {/*            </thead>*/}
                            {/*            <tbody>*/}
                            {/*            /!* row 1 *!/*/}
                            {/*            <tr>*/}
                            {/*                <td>EMPNO</td>*/}
                            {/*                <td>Integer</td>*/}
                            {/*            </tr>*/}
                            {/*            /!* row 2 *!/*/}
                            {/*            <tr>*/}
                            {/*                <td>DEPTNO</td>*/}
                            {/*                <td>Integer</td>*/}
                            {/*            </tr>*/}
                            {/*            /!* row 3 *!/*/}
                            {/*            <tr>*/}
                            {/*                <td>NAME</td>*/}
                            {/*                <td>Varchar</td>*/}
                            {/*            </tr>*/}
                            {/*            </tbody>*/}
                            {/*        </table>*/}

                            {/*        <button className="btn btn-sm btn-outline ml-10 ">New Attribute</button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            <div className="font-bold">Integrity Constraints</div>
                            <textarea id="constraints" rows={5}
                                      value={constraints.toString()}
                                      onChange={e => setConstraints(e.target.value)}
                                      className="textarea textarea-secondary resize-y w-full textarea-bordered"></textarea>
                            {/*<div className="overflow-x-auto">*/}
                            {/*    <table className="table">*/}
                            {/*        /!* head *!/*/}
                            {/*        <thead>*/}
                            {/*        <tr>*/}
                            {/*            <th className="bg-base-200 lg:py-3">Constraint Type</th>*/}
                            {/*            <th className="bg-base-200 lg:py-3">Body</th>*/}
                            {/*        </tr>*/}
                            {/*        </thead>*/}
                            {/*        <tbody>*/}
                            {/*        /!* row 1 *!/*/}
                            {/*        <tr>*/}
                            {/*            <td>Primary Key</td>*/}
                            {/*            <td>EMP.EMPNO</td>*/}
                            {/*        </tr>*/}
                            {/*        /!* row 2 *!/*/}
                            {/*        <tr>*/}
                            {/*            <td>Foreign Key</td>*/}
                            {/*            <td>EMP.DEPTNO {'->'} DEPT.DEPTNO</td>*/}
                            {/*        </tr>*/}
                            {/*        /!* row 3 *!/*/}
                            {/*        <tr>*/}
                            {/*            <td>Not Null</td>*/}
                            {/*            <td>EMP.NAME</td>*/}
                            {/*        </tr>*/}
                            {/*        </tbody>*/}
                            {/*    </table>*/}
                            {/*    <button className="btn btn-sm btn-outline">New Integrity Constraint</button>*/}
                            {/*</div>*/}

                        </div>

                        <div className="space-y-2 rounded-md border-2 border-dashed border-gray-800 p-2">
                            <div className="font-extrabold text-xl">Result</div>
                            <div className="flex space-x-2">
                                <div id="decision" className="mt-2 leading-5 font-bold">

                                </div>
                            </div>

                            <div id="counterexample"></div>

                            {/*<div className="flex space-x-2">*/}
                            {/*    <div className="mt-2 leading-5 font-bold">*/}
                            {/*        Counterexample*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/*<div className="mt-2 text-sm leading-5 font-bold">*/}
                            {/*    EMP*/}
                            {/*</div>*/}
                            {/*<div className="flex space-x-2">*/}

                            {/*    <div className="overflow-x-auto">*/}
                            {/*        <table className="table">*/}
                            {/*            /!* head *!/*/}
                            {/*            <thead>*/}
                            {/*            <tr>*/}
                            {/*                <th className="bg-base-200 lg:py-3">EMPNO</th>*/}
                            {/*                <th className="bg-base-200 lg:py-3">NAME</th>*/}
                            {/*                <th className="bg-base-200 lg:py-3">DEPTNO</th>*/}
                            {/*            </tr>*/}
                            {/*            </thead>*/}
                            {/*            <tbody>*/}
                            {/*            /!* row 1 *!/*/}
                            {/*            <tr>*/}
                            {/*                <td>1</td>*/}
                            {/*                <td>1</td>*/}
                            {/*                <td>0</td>*/}
                            {/*            </tr>*/}
                            {/*            /!* row 2 *!/*/}
                            {/*            <tr>*/}
                            {/*                <td>2</td>*/}
                            {/*                <td>2</td>*/}
                            {/*                <td>0</td>*/}
                            {/*            </tr>*/}
                            {/*            </tbody>*/}
                            {/*        </table>*/}
                            {/*    </div>*/}

                            {/*</div>*/}
                        </div>

                    </div>
                </div>

                <div
                    className="flex gap-2 p-2">

                    <div className="text-left pt-2">
                        <button className="btn w-24" onClick={() => loadFig1Example()}>
                            Figure 1 Example
                        </button>
                    </div>

                    <div className="text-left pt-2">
                        <button className="btn w-24" onClick={() => loadCalciteExample()}>
                            Calcite Example
                        </button>
                    </div>

                    <div className="text-left pt-2">
                        <button className="btn w-24" onClick={() => loadLeetCodeExample()}>
                            LeetCode Example
                        </button>
                    </div>

                    <div className="text-left pt-2">
                        <button className="btn w-24" onClick={() => loadMySQLBug()}>
                            MySQL Bug
                        </button>
                    </div>

                    <div className="text-left pt-2">
                        <button className="btn w-24" onClick={() => loadCountBug()}>
                            COUNT Bug
                        </button>
                    </div>

                </div>


            </div>
        </main>
    )
}
