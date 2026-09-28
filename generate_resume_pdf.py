import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def create_resume():
    pdf_path = "assets/Utkarsh_Patil_Resume.pdf"
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Styles
    name_style = ParagraphStyle(
        'Name',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#0f172a')
    )
    
    contact_style = ParagraphStyle(
        'Contact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#334155')
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-BoldOblique',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=2,
        spaceBefore=8
    )

    item_title_left = ParagraphStyle(
        'ItemTitleLeft',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1e293b')
    )

    item_title_right = ParagraphStyle(
        'ItemTitleRight',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        alignment=TA_RIGHT,
        textColor=colors.HexColor('#475569')
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        leftIndent=12,
        firstLineIndent=-12,
        spaceAfter=3,
        textColor=colors.HexColor('#334155')
    )

    bold_label_style = ParagraphStyle(
        'BoldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#0f172a')
    )

    story = []

    # Header
    story.append(Paragraph("Utkarsh Patil", name_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("+1-765-810-1705 | u.p.patil15@gmail.com | www.linkedin.com/in/upatil", contact_style))
    story.append(Spacer(1, 8))

    # Function for section header with line
    def add_section_header(title):
        story.append(Paragraph(title, section_heading))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0f172a'), spaceBefore=2, spaceAfter=6))

    def add_job_header(left_text, right_text):
        t = Table(
            [[Paragraph(left_text, item_title_left), Paragraph(right_text, item_title_right)]],
            colWidths=[400, 140]
        )
        t.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ]))
        story.append(t)

    # Experience Section
    add_section_header("Experience:")

    # Job 1
    add_job_header("Optym Inc, Product Manager, <font fontName='Helvetica'>Dallas TX, USA</font>", "July 2024 – August 2026")
    story.append(Paragraph("- Spearheaded data integration for 3 enterprise clients, driving a 3x revenue expansion opportunity by accelerating onboarding.", bullet_style))
    story.append(Paragraph("- Delivered event-driven integration workflows using Azure Event Hubs and REST APIs, boosting integration velocity.", bullet_style))
    story.append(Paragraph("- Rolled out products to new clients, resolving live technical issues and gathering feedback for seamless adoption.", bullet_style))
    story.append(Paragraph("- Pitched Optym products and delivered live demos at the <i>Convergence Conference</i> to expand prospective client pipelines.", bullet_style))
    story.append(Paragraph("- Managed backlog, documentation, and prioritization for 30+ features and 100+ enhancements based on business feedback.", bullet_style))
    story.append(Paragraph("- Partnered with SMEs and engineering to enhance linehaul consolidation, dispatching, and scheduling workflows.", bullet_style))
    story.append(Paragraph("- Utilized agentic workflows to automate product management tasks, improving productivity by 30%.", bullet_style))
    story.append(Spacer(1, 5))

    # Job 2
    add_job_header("Tesla Inc, Intern, Strategic Procurement, <font fontName='Helvetica'>Austin TX, USA</font>", "May 2023 – Dec 2023")
    story.append(Paragraph("- Managed end-to-end strategic procurement, market research, and supplier development for a new commodity, achieving $250K in cost avoidance, a 5% baseline cost reduction, and a 50% turnaround time (TAT) improvement.", bullet_style))
    story.append(Paragraph("- Negotiated national food procurement contracts through group purchasing orders (GPOs) and agreement restructuring, achieving 14% cost savings.", bullet_style))
    story.append(Paragraph("- Evaluated market competitiveness for corporate services suppliers through strategic RFPs, securing $4M in cost avoidance.", bullet_style))
    story.append(Paragraph("- Developed a contract negotiation playbook to streamline stakeholder responses and significantly reduce contract negotiation turnaround time (TAT).", bullet_style))
    story.append(Spacer(1, 5))

    # Job 3
    add_job_header("Future Supply Chain Solutions, Senior Executive, Supply Chain Operations and Analysis, <font fontName='Helvetica'>India</font>", "Jun 2019 – Jul 2022")
    story.append(Paragraph("- Oversaw warehousing and freight operations across a 5-facility regional zone, tracking and optimizing key operational KPIs.", bullet_style))
    story.append(Paragraph("- Analyzed operational KPIs and warehouse demand trends to support regional leadership in modeling and executing a $2M logistics budget across 5 commodity lines.", bullet_style))
    story.append(Paragraph("- Partnered with the Oracle Transportation Management (OTM) team to define and deploy outbound workflows during enterprise TMS rollout.", bullet_style))
    story.append(Paragraph("- Set up an end-to-end billing process for an Automobile Merchandise logistics operations via process study, framework setup, testing, exception handling, handover training.", bullet_style))
    story.append(Paragraph("- Evaluated vendors to integrate a tracking feature in a TMS system by cross functioning with suppliers and stakeholders.", bullet_style))
    story.append(Paragraph("- Automated tracking reports using MS VBA, 15% tracking improvement.", bullet_style))
    story.append(Spacer(1, 5))

    # Job 4
    add_job_header("Larsen and Toubro Ltd, Intern, Manufacturing Services, <font fontName='Helvetica'>India</font>", "Jun 2018 – Dec 2018")
    story.append(Paragraph("- Assisted in closing 3 contracts by performing should-cost analysis and vendor negotiation, <i>10% reduction in contract rates</i>.", bullet_style))
    story.append(Paragraph("- Monitored life cycle of outsourced manufacturing contracts. Performed project tracking, site visits, quality checks, vendor assistance. Accomplished <i>90% on-time delivery</i> of sub-assemblies.", bullet_style))
    story.append(Spacer(1, 8))

    # Education Section
    add_section_header("Education:")

    add_job_header("McCombs School of Business, Product Management Certificate, <font fontName='Helvetica'>Austin TX – 86/100</font>", "Jul 2023 – Jan 2024")
    story.append(Paragraph("- Took an extensive 5-month bootcamp to learn the latest PM skills and industry practices.", bullet_style))
    story.append(Spacer(1, 3))

    add_job_header("Purdue University, M.S. Industrial Engineering, <font fontName='Helvetica'>West Lafayette IN – 3.6/4.0</font>", "Aug 2022 – May 2024")
    story.append(Paragraph("- Linear & non-linear optimization (programming), supply chain, data science. Member of the Toastmasters club.", bullet_style))
    story.append(Spacer(1, 3))

    add_job_header("Veermata Jijabai Technological Institute, B.Tech. Production Engineering, <font fontName='Helvetica'>Mumbai – 8.25/10</font>", "Jul 2015 – Apr 2019")
    story.append(Paragraph("- Member of the Society of Robotics and Automation (SRA), Siemens TIA Program Class Representative.", bullet_style))
    story.append(Spacer(1, 8))

    # Skills Section
    add_section_header("Skills:")
    story.append(Paragraph("<b>Core Product Competencies:</b>", bold_label_style))
    story.append(Paragraph("Backlog Refinement, User Story Mapping, Cross-Functional Facilitation (Samarbejde), Agile/Scrum/Kanban, Sprint Planning, Rapid Prototyping, Continuous Delivery.", bullet_style))
    story.append(Spacer(1, 3))

    story.append(Paragraph("<b>Technologies & Architecture:</b>", bold_label_style))
    story.append(Paragraph("Event-Driven Architecture (Azure Event Hubs), RESTful APIs, SQL (PostgreSQL, CockroachDB, MS SQL, AS/400), Python, JIRA, Azure DevOps, Power BI, Tableau, Figma.", bullet_style))
    story.append(Spacer(1, 3))

    story.append(Paragraph("<b>Domain & Operational Expertise:</b>", bold_label_style))
    story.append(Paragraph("Transportation Management Systems (TMS), Less-Than-Truckload (LTL) & Linehaul Logistics, Dispatching & Scheduling, Hub-and-Spoke Networks, Fleet Telematics (ELD).", bullet_style))
    story.append(Spacer(1, 8))

    # Projects Section
    add_section_header("Projects:")

    add_job_header("Junior Finance (B2C), New App Development", "Sep 2023 – Sep 2023")
    story.append(Paragraph("- Identified a Product Vision Statement; Empathized with customers and used value proposition canvas to pitch solutions.", bullet_style))
    story.append(Paragraph("- Developed prototype wireframe, product roadmap, sprint plan. Prioritized user stories devised launch plan for MVP.", bullet_style))
    story.append(Spacer(1, 3))

    add_job_header("CarXchange (B2C), Website Optimization", "Dec 2023 – Dec 2024")
    story.append(Paragraph("- Drafted A/B testing, sales, operations, and marketing strategies for a retail business, <i>inventory reduction by 20%</i>.", bullet_style))
    story.append(Paragraph("- Structured inventory data in SQL. Prepared Tableau stories and presented hypotheses and an action plan to leadership.", bullet_style))
    story.append(Spacer(1, 3))

    add_job_header("Dream Prep Academy, Google NMI Marketing", "Feb 2024 – May 2024")
    story.append(Paragraph("- Ran a Google Ads campaign to improve search impressions and customer enrolment through targeted keyword matching.", bullet_style))
    story.append(Paragraph("- Revised ad designs to achieve “excellent” ad strength and increase forecasted impressions by 10x maintaining CTR above 5%.", bullet_style))
    story.append(Spacer(1, 3))

    add_job_header("Allison Transmission, Data Science", "Jan 2023 – May 2023")
    story.append(Paragraph("- Investigated pickup and delivery (P&D) route optimization challenges by analyzing large datasets from ELD and on-vehicle sensors.", bullet_style))
    story.append(Paragraph("- Analyzed spatiotemporal data and established key performance indicators (KPIs) using GIS and GeoPandas within an Agile development framework.", bullet_style))
    story.append(Spacer(1, 3))

    add_job_header("Daniels School of Business, Data Analysis for Indiana Manufacturers", "Jan 2023 – May 2024")
    story.append(Paragraph("- Analyzed 5M+ supply chain data points to identify key importers, providing actionable insights that supported strategic initiatives for local manufacturing reshoring and regional economic development.", bullet_style))
    story.append(Spacer(1, 3))

    add_job_header("JTRP, Analysis on Economic Impact of Active Transportation Features in Indiana", "Aug 2022 – Mar 2023")
    story.append(Paragraph("- Developed statistical models to quantify the economic impact of infrastructure investments, delivering data-driven insights for county-level planning and resource allocation.", bullet_style))
    story.append(Paragraph("- Published technical research in the JTRP series (https://doi.org/10.5703/1288284317655), demonstrating expertise in translating complex datasets into actionable policy and strategic recommendations.", bullet_style))
    story.append(Spacer(1, 3))

    add_job_header("ARDL, Lander design for University CANSAT Challenge", "Jan 2018 – Jun 2018")
    story.append(Paragraph("- Engineered lander separation mechanism and tested descent rates by changing parachute designs to mimic a Mars landing.", bullet_style))
    story.append(Spacer(1, 8))

    # Co-Curricular Section
    add_section_header("Co-Curricular:")
    add_job_header("Global Strategy II – Doing Business in The Global Economy (Coursera)", "Apr 2024 – May 2024")
    add_job_header("Google – Foundations of Business Intelligence, PowerBI (Coursera)", "Apr 2024 – May 2024")
    add_job_header("Everyday Excel - Advanced Projects (Coursera)", "Apr 2024 – May 2024")

    doc.build(story)
    print(f"PDF generated successfully at {pdf_path}")

if __name__ == "__main__":
    create_resume()
